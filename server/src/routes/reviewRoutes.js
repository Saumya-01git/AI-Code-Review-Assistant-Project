import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { analyzeStaticCode } from '../services/staticAnalyzer.js';
import { reviewCodeWithAI } from '../services/aiReviewer.js';
import { analyzeComplexity } from '../services/complexityAnalyzer.js';
import { generateDocumentation } from '../services/docGenerator.js';
import { db } from '../db/database.js';

const router = Router();

// Generate Auto-Documentation for Functions, Classes, and APIs
router.post('/reviews/docs', authenticateToken, (req, res) => {
  try {
    const { code, language, fileName } = req.body;
    if (!code || !code.trim()) {
      return res.status(400).json({ success: false, message: 'Source code is required.' });
    }

    const lang = language || 'javascript';
    const targetFile = fileName || 'code.js';

    const docs = generateDocumentation(code, lang, targetFile);
    return res.json(docs);
  } catch (error) {
    console.error('Doc generation error:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate documentation.' });
  }
});

// Run Complexity Analysis & Code Smell Reporting
router.post('/reviews/complexity', authenticateToken, (req, res) => {
  try {
    const { code, language, fileName } = req.body;
    if (!code || !code.trim()) {
      return res.status(400).json({ success: false, message: 'Source code is required.' });
    }

    const lang = language || 'javascript';
    const targetFile = fileName || 'code.js';

    const complexityResult = analyzeComplexity(code, lang, targetFile);
    return res.json(complexityResult);
  } catch (error) {
    console.error('Complexity analysis error:', error);
    return res.status(500).json({ success: false, message: 'Failed to analyze code complexity.' });
  }
});

// Run Full Review Suite: Stage 1 Static + Stage 2 AI + Complexity Metrics
router.post('/reviews/full', authenticateToken, async (req, res) => {
  try {
    const { code, language, fileName, customApiKey, saveToHistory, projectId } = req.body;
    const userId = req.user.id;

    if (!code || !code.trim()) {
      return res.status(400).json({ success: false, message: 'Source code is required.' });
    }

    const lang = language || 'javascript';
    const targetFile = fileName || 'code.js';

    // 1. Stage 1 Static Analysis
    const staticResult = analyzeStaticCode(code, lang, targetFile);

    // 2. Complexity & Code Smells
    const complexityResult = analyzeComplexity(code, lang, targetFile);

    // 3. Stage 2 AI Review
    const aiResult = await reviewCodeWithAI(code, lang, targetFile, customApiKey);

    // Composite Quality Score (0-100)
    const staticErrors = staticResult.summary.errors;
    const staticWarnings = staticResult.summary.warnings;
    const staticDeduction = (staticErrors * 12) + (staticWarnings * 5);
    const smellDeduction = complexityResult.summary.totalSmells * 3;
    const cyclomaticDeduction = Math.max(0, complexityResult.cyclomaticComplexity.score - 5) * 2;

    let overallScore = 100 - staticDeduction - smellDeduction - cyclomaticDeduction;
    overallScore = Math.max(25, Math.min(100, Math.round((overallScore + aiResult.aiScore) / 2)));

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

      const summaryText = `Full 2-Stage Review: Score ${overallScore}/100. ${staticResult.findings.length} static findings, ${complexityResult.codeSmells.length} code smells, Cyclomatic: ${complexityResult.cyclomaticComplexity.score}.`;
      
      const metricsJson = JSON.stringify({
        cyclomatic: complexityResult.cyclomaticComplexity.score,
        loc: complexityResult.metrics.linesOfCode,
        functions: complexityResult.metrics.functionsCount,
        classes: complexityResult.metrics.classesCount
      });

      const reviewInsert = db.prepare(`
        INSERT INTO reviews (project_id, review_type, overall_score, summary, language, raw_code, metrics)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(targetProjectId, 'full_suite', overallScore, summaryText, lang, code, metricsJson);

      savedReviewId = Number(reviewInsert.lastInsertRowid);

      const insertFinding = db.prepare(`
        INSERT INTO review_findings (review_id, severity, issue, explanation, suggested_fix, file_name, line_number)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      // Save static findings
      for (const f of staticResult.findings) {
        insertFinding.run(savedReviewId, f.severity, f.issue, f.explanation, f.suggested_fix, targetFile, f.line_number);
      }

      // Save code smells as findings
      for (const s of complexityResult.codeSmells) {
        insertFinding.run(savedReviewId, s.severity, s.issue, s.explanation, s.suggested_fix, targetFile, s.line_number);
      }

      // Save AI bugs as findings
      for (const b of (aiResult.bugs || [])) {
        insertFinding.run(savedReviewId, b.severity, b.title, b.description, b.recommendation, targetFile, b.lineNumber || 1);
      }
    }

    return res.json({
      success: true,
      reviewId: savedReviewId,
      overallScore,
      static: staticResult,
      complexity: complexityResult,
      ai: aiResult
    });
  } catch (error) {
    console.error('Full review suite error:', error);
    return res.status(500).json({ success: false, message: 'Failed to process full review suite.' });
  }
});

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

// List User Review History with Search & Filtering
router.get('/reviews', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const { q, language, reviewType, minScore } = req.query;

    let query = `
      SELECT r.*, p.project_name, COUNT(rf.id) as findings_count
      FROM reviews r
      JOIN projects p ON r.project_id = p.id
      LEFT JOIN review_findings rf ON r.id = rf.review_id
      WHERE p.user_id = ?
    `;
    const params = [userId];

    if (q && q.trim()) {
      query += ` AND (r.summary LIKE ? OR r.raw_code LIKE ? OR r.language LIKE ?)`;
      const searchPattern = `%${q.trim()}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    if (language && language !== 'all') {
      query += ` AND LOWER(r.language) = LOWER(?)`;
      params.push(language);
    }

    if (reviewType && reviewType !== 'all') {
      query += ` AND r.review_type = ?`;
      params.push(reviewType);
    }

    if (minScore) {
      query += ` AND r.overall_score >= ?`;
      params.push(Number(minScore));
    }

    query += ` GROUP BY r.id ORDER BY r.created_at DESC`;

    const reviews = db.prepare(query).all(...params);

    return res.json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    console.error('List reviews error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch review history.' });
  }
});

// Delete specific review
router.delete('/reviews/:id', authenticateToken, (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user.id;

    // Verify ownership
    const review = db.prepare(`
      SELECT r.id FROM reviews r
      JOIN projects p ON r.project_id = p.id
      WHERE r.id = ? AND p.user_id = ?
    `).get(reviewId, userId);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found or unauthorized.' });
    }

    db.prepare('DELETE FROM review_findings WHERE review_id = ?').run(reviewId);
    db.prepare('DELETE FROM reviews WHERE id = ?').run(reviewId);

    return res.json({
      success: true,
      message: `Review #${reviewId} deleted successfully.`
    });
  } catch (error) {
    console.error('Delete review error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete review.' });
  }
});

// Delete all reviews for the current user
router.delete('/reviews', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const userReviews = db.prepare(`
      SELECT r.id FROM reviews r
      JOIN projects p ON r.project_id = p.id
      WHERE p.user_id = ?
    `).all(userId);

    for (const r of userReviews) {
      db.prepare('DELETE FROM review_findings WHERE review_id = ?').run(r.id);
      db.prepare('DELETE FROM reviews WHERE id = ?').run(r.id);
    }

    return res.json({
      success: true,
      message: `Cleared all (${userReviews.length}) reviews for user.`
    });
  } catch (error) {
    console.error('Bulk delete reviews error:', error);
    return res.status(500).json({ success: false, message: 'Failed to clear review history.' });
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
