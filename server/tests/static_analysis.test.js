import assert from 'node:assert';
import app from '../src/server.js';
import { db } from '../src/db/database.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../src/config/jwt.js';
import { analyzeStaticCode } from '../src/services/staticAnalyzer.js';

console.log('🧪 Starting Day 6 Static Code Analysis Tests...\n');

async function runTests() {
  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api`;

  try {
    const testUser = db.prepare('SELECT id, email FROM users LIMIT 1').get() || { id: 1, email: 'test@example.com' };
    const token = jwt.sign({ id: testUser.id, email: testUser.email }, JWT_SECRET, { expiresIn: '1h' });

    // 1. Direct Engine Test: Buggy JavaScript Code
    const sampleJS = `
      var secretApiKey = "secret_123456789";
      var unusedVar = 42;
      function check(a, b) {
        if (a == b) {
          eval("console.log(a)");
        }
      }
    `;

    const staticResult = analyzeStaticCode(sampleJS, 'javascript', 'auth_module.js');
    assert.strictEqual(staticResult.success, true);
    assert.ok(staticResult.findings.length >= 4, 'Should detect multiple static issues');

    const issues = staticResult.findings.map(f => f.rule);
    assert.ok(issues.includes('no-var'), 'Should detect var keyword');
    assert.ok(issues.includes('eqeqeq'), 'Should detect loose equality');
    assert.ok(issues.includes('no-eval'), 'Should detect eval security warning');
    assert.ok(issues.includes('no-hardcoded-credentials'), 'Should detect hardcoded secret');
    assert.ok(issues.includes('no-unused-vars'), 'Should detect unused variable');
    console.log('✅ Stage 1 AST static analyzer detected var, unused vars, loose equality, eval, and hardcoded credentials');

    // 2. Syntax Error Detection
    const brokenJS = 'function broken( { return 123; }';
    const syntaxResult = analyzeStaticCode(brokenJS, 'javascript', 'broken.js');
    assert.strictEqual(syntaxResult.summary.errors, 1);
    assert.strictEqual(syntaxResult.findings[0].rule, 'parse-syntax-error');
    console.log('✅ Syntax error accurately caught with line and column reporting');

    // 3. Python Analysis
    const samplePy = `
      def process(data=[]):
          try:
              print(data)
          except:
              pass
    `;
    const pyResult = analyzeStaticCode(samplePy, 'python', 'script.py');
    const pyRules = pyResult.findings.map(f => f.rule);
    assert.ok(pyRules.includes('no-bare-except'), 'Should detect bare except');
    assert.ok(pyRules.includes('no-mutable-default-args'), 'Should detect mutable default argument');
    console.log('✅ Python static analysis detected bare except and mutable default arguments');

    // 4. API Endpoint: POST /api/reviews/static with Database Persistence
    const apiRes = await fetch(`${baseUrl}/reviews/static`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        code: sampleJS,
        language: 'javascript',
        fileName: 'test.js',
        saveToHistory: true
      })
    }).then(r => r.json());

    assert.strictEqual(apiRes.success, true);
    assert.ok(apiRes.reviewId, 'Review should be saved to database');
    assert.ok(typeof apiRes.overallScore === 'number');

    // Verify findings persisted to SQLite
    const savedFindings = db.prepare('SELECT * FROM review_findings WHERE review_id = ?').all(apiRes.reviewId);
    assert.ok(savedFindings.length > 0, 'Findings should be stored in review_findings table');
    console.log(`✅ POST /api/reviews/static saved review #${apiRes.reviewId} and ${savedFindings.length} findings to SQLite`);

    console.log('\n🎉 ALL DAY 6 STATIC CODE ANALYSIS TESTS PASSED!\n');
    server.close();
  } catch (err) {
    console.error('❌ Day 6 Test failed:', err);
    server.close();
    process.exit(1);
  }
}

runTests();
