import assert from 'node:assert';
import app from '../src/server.js';
import { db } from '../src/db/database.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../src/config/jwt.js';
import { analyzeComplexity } from '../src/services/complexityAnalyzer.js';

console.log('🧪 Starting Day 9 Complexity & Code Smell Tests...\n');

async function runTests() {
  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api`;

  try {
    const testUser = db.prepare('SELECT id, email FROM users LIMIT 1').get() || { id: 1, email: 'test@example.com' };
    const token = jwt.sign({ id: testUser.id, email: testUser.email }, JWT_SECRET, { expiresIn: '1h' });

    const complexSnippet = `
      // Sample complex module with multiple decisions
      class OrderManager {
        constructor() {
          this.orders = [];
        }

        processOrder(orderId, customerId, discountCode, taxRate, isVip) {
          if (orderId && customerId) {
            if (discountCode) {
              if (isVip && taxRate > 0.05) {
                return 45000;
              } else {
                return 25000;
              }
            }
          }
          return 0;
        }
      }
    `;

    // 1. Direct Engine Test
    const res = analyzeComplexity(complexSnippet, 'javascript', 'order.js');
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.metrics.classesCount, 1);
    assert.ok(res.cyclomaticComplexity.score >= 5, 'Should calculate cyclomatic complexity');
    assert.strictEqual(res.metrics.functionsCount, 2); // constructor and processOrder
    assert.ok(res.codeSmells.length > 0, 'Should detect code smells');

    const smellTypes = res.codeSmells.map(s => s.smellType);
    assert.ok(smellTypes.includes('Long Parameter List'), 'Should detect long parameter list (5 params)');
    assert.ok(smellTypes.includes('Deep Nesting'), 'Should detect deep nesting hierarchy');
    console.log('✅ Complexity engine calculated Cyclomatic Score, LOC, Functions, Classes, and detected Code Smells');

    // 2. Full Suite Review API Test (Stage 1 + Stage 2 + Complexity)
    const fullRes = await fetch(`${baseUrl}/reviews/full`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        code: complexSnippet,
        language: 'javascript',
        fileName: 'order.js',
        saveToHistory: true
      })
    }).then(r => r.json());

    assert.strictEqual(fullRes.success, true);
    assert.ok(fullRes.reviewId, 'Review persisted in DB');
    assert.ok(fullRes.static, 'Includes Stage 1 static');
    assert.ok(fullRes.complexity, 'Includes Complexity metrics');
    assert.ok(fullRes.ai, 'Includes Stage 2 AI reasoning');
    assert.ok(typeof fullRes.overallScore === 'number');

    // Check saved metrics in reviews table
    const dbReview = db.prepare('SELECT metrics, overall_score FROM reviews WHERE id = ?').get(fullRes.reviewId);
    assert.ok(dbReview.metrics, 'Metrics JSON stored');
    console.log(`✅ Full review suite executed, generating composite score ${fullRes.overallScore}/100 and persisting to SQLite`);

    console.log('\n🎉 ALL DAY 9 COMPLEXITY & CODE SMELL TESTS PASSED!\n');
    server.close();
  } catch (err) {
    console.error('❌ Day 9 Test failed:', err);
    server.close();
    process.exit(1);
  }
}

runTests();
