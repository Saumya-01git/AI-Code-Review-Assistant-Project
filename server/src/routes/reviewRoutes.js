import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { analyzeStaticCode } from '../services/staticAnalyzer.js';
import { reviewCodeWithAI } from '../services/aiReviewer.js';
import { db } from '../db/database.js';

const router = Router();

// Run Stage 2 AI-Powered Code Review
router.post('/reviews/ai', authenticateToken, async (req, res) => {
  try {
    const { code, language, fileName, customApiKey, saveToHistory, projectId } = req.body;
    const userId = req.user.id;

    if (!code || !code.trim()) {
      return res.status(400).json({ success: false, message: 'Source code is required.' });
    }

    const lang = language || 'javascript';
    const targetFile = fileName || 'snippet.js';

    // Execute Stage 2 AI Review
    const aiResult = await reviewCodeWithAI(code, lang, targetFile, customApiKey);

    let savedReviewId = null;

    if (saveToHistory) {
      let targetProjectId = projectId;
      if (!targetProjectId) {
        const p = db.prepare('SELECT id FROM projects WHERE user_id = ? ORDER BY id ASC LIMIT 1').get(userId);
        targetProjectId = p ? p.id : null;
        if (!targetProjectId) {
          const ins = db.prepare('INSERT INTO projects (user_id, project_name) VALUES (?, ?)').run(userId, 'Default Project');
          targetProjectId = Number(ins.lastInsertRowid);
        }
      }

      const reviewInsert = db.prepare(`
        INSERT INTO reviews (project_id, review_type, overall_score, summary, language, raw_code)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(targetProjectId, 'ai_review', aiResult.aiScore, aiResult.overview, lang, code);

      savedReviewId = Number(reviewInsert.lastInsertRowid);

      // Insert AI bugs as findings
      const insertFinding = db.prepare(`
        INSERT INTO review_findings (review_id, severity, issue, explanation, suggested_fix, file_name, line_number)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      for (const bug of (aiResult.bugs || [])) {
        insertFinding.run(
          savedReviewId,
          bug.severity,
          bug.title,
          bug.description,
          bug.recommendation,
          targetFile,
          bug.lineNumber || 1
        );
      }
    }

    return res.json({
      success: true,
      reviewId: savedReviewId,
      ...aiResult
    });
  } catch (error) {
    console.error('AI review error:', error);
    return res.status(500).json({ success: false, message: 'Failed to process AI code review.' });
  }
});

// Run Stage 1 Static Code Analysis
router.post('/reviews/static', authenticateToken, (req, res) => {
  try {
    const { code, language, fileName, saveToHistory, projectId } = req.body;
    const userId = req.user.id;

    if (!code || !code.trim()) {
      return res.status(400).json({ success: false, message: 'Source code is required.' });
    }

    const lang = language || 'javascript';
    const targetFile = fileName || 'snippet.js';

    // Execute Static Code Analysis
    const analysisResult = analyzeStaticCode(code, lang, targetFile);

    // Calculate score deduction based on static issues
    const { errors, warnings, infos } = analysisResult.summary;
    let score = 100 - (errors * 15) - (warnings * 6) - (infos * 2);
    score = Math.max(10, Math.min(100, score));

    let savedReviewId = null;

    if (saveToHistory) {
      // Find or create project
      let targetProjectId = projectId;
      if (!targetProjectId) {
        const p = db.prepare('SELECT id FROM projects WHERE user_id = ? ORDER BY id ASC LIMIT 1').get(userId);
        targetProjectId = p ? p.id : null;
        if (!targetProjectId) {
          const ins = db.prepare('INSERT INTO projects (user_id, project_name) VALUES (?, ?)').run(userId, 'Default Project');
          targetProjectId = Number(ins.lastInsertRowid);
        }
      }

      const summaryText = `Stage 1 Static Analysis: ${errors} errors, ${warnings} warnings, ${infos} styling suggestions.`;
      
      const reviewInsert = db.prepare(`
        INSERT INTO reviews (project_id, review_type, overall_score, summary, language, raw_code)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(targetProjectId, 'static_analysis', score, summaryText, lang, code);

      savedReviewId = Number(reviewInsert.lastInsertRowid);

      // Insert each finding into review_findings table
      const insertFinding = db.prepare(`
        INSERT INTO review_findings (review_id, severity, issue, explanation, suggested_fix, file_name, line_number)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      for (const f of analysisResult.findings) {
        insertFinding.run(
          savedReviewId,
          f.severity,
          f.issue,
          f.explanation,
          f.suggested_fix,
          f.file_name,
          f.line_number
        );
      }
    }

    return res.json({
      success: true,
      reviewId: savedReviewId,
      overallScore: score,
      ...analysisResult
    });
  } catch (error) {
    console.error('Static review error:', error);
    return res.status(500).json({ success: false, message: 'Failed to perform static code analysis.' });
  }
});

// Get review details by ID
router.get('/reviews/:id', authenticateToken, (req, res) => {
  try {
    const reviewId = req.params.id;
    const review = db.prepare(`
      SELECT r.*, p.project_name
      FROM reviews r
      JOIN projects p ON r.project_id = p.id
      WHERE r.id = ? AND p.user_id = ?
    `).get(reviewId, req.user.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    const findings = db.prepare('SELECT * FROM review_findings WHERE review_id = ? ORDER BY line_number ASC').all(reviewId);

    return res.json({
      success: true,
      review,
      findings
    });
  } catch (error) {
    console.error('Fetch review error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch review.' });
  }
});

export default router;
