import assert from 'node:assert';
import app from '../src/server.js';
import { db } from '../src/db/database.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../src/config/jwt.js';
import { reviewCodeWithAI } from '../src/services/aiReviewer.js';

console.log('🧪 Starting Day 8 AI Code Review & Explanation Tests...\n');

async function runTests() {
  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api`;

  try {
    const testUser = db.prepare('SELECT id, email FROM users LIMIT 1').get() || { id: 1, email: 'test@example.com' };
    const token = jwt.sign({ id: testUser.id, email: testUser.email }, JWT_SECRET, { expiresIn: '1h' });

    const sampleCode = `
      function authenticateUser(req, res) {
        var user_name = req.body.username;
        if (user_name == "admin") {
          return res.status(200).json({ status: "success" });
        } else {
          res.status(401);
        }
      }

      function sumItems(items) {
        let total = 0;
        for (let i = 0; i < items.length; i++) {
          for (let j = 0; j < items[i].discounts.length; j++) {
            total += items[i].discounts[j].rate;
          }
        }
        return total;
      }
    `;

    // 1. Direct Engine Test
    const aiResult = await reviewCodeWithAI(sampleCode, 'javascript', 'auth.js');
    assert.strictEqual(aiResult.success, true);
    assert.ok(aiResult.codeExplanation.length > 20, 'Should generate plain-English explanation');
    assert.ok(aiResult.bugs.length > 0, 'Should detect logical bugs');
    assert.ok(aiResult.namingSuggestions.length > 0, 'Should offer naming suggestions');
    assert.ok(aiResult.performanceOptimizations.length > 0, 'Should offer performance suggestions');
    assert.ok(aiResult.refactoredCode.includes('authenticateUser'), 'Should generate refactored code');
    console.log('✅ AI engine generated code explanation, detected bugs, naming suggestions, and refactored code');

    // 2. API Endpoint Test with database save
    const apiRes = await fetch(`${baseUrl}/reviews/ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        code: sampleCode,
        language: 'javascript',
        fileName: 'auth.js',
        saveToHistory: true
      })
    }).then(r => r.json());

    assert.strictEqual(apiRes.success, true);
    assert.ok(apiRes.reviewId, 'Review should be saved');
    assert.ok(typeof apiRes.aiScore === 'number');

    const savedFindings = db.prepare('SELECT * FROM review_findings WHERE review_id = ?').all(apiRes.reviewId);
    assert.ok(savedFindings.length > 0, 'AI findings persisted');
    console.log(`✅ POST /api/reviews/ai persisted AI review #${apiRes.reviewId} and ${savedFindings.length} findings`);

    console.log('\n🎉 ALL DAY 8 AI CODE REVIEW TESTS PASSED!\n');
    server.close();
  } catch (err) {
    console.error('❌ Day 8 Test failed:', err);
    server.close();
    process.exit(1);
  }
}

runTests();
