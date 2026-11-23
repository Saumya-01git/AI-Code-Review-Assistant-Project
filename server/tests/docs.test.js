import assert from 'node:assert';
import app from '../src/server.js';
import { db } from '../src/db/database.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../src/config/jwt.js';
import { generateDocumentation } from '../src/services/docGenerator.js';

console.log('🧪 Starting Day 10 Documentation Generator Tests...\n');

async function runTests() {
  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api`;

  try {
    const testUser = db.prepare('SELECT id, email FROM users LIMIT 1').get() || { id: 1, email: 'test@example.com' };
    const token = jwt.sign({ id: testUser.id, email: testUser.email }, JWT_SECRET, { expiresIn: '1h' });

    const sampleModule = `
      class PaymentGateway {
        constructor() {}
      }

      function processCharge(userId, amount, currency = "USD") {
        return { status: "success", chargeId: 99 };
      }

      app.post('/api/charges', (req, res) => {
        res.json({ ok: true });
      });
    `;

    // 1. Direct Engine Test
    const docResult = generateDocumentation(sampleModule, 'javascript', 'payment.js');
    assert.strictEqual(docResult.success, true);
    assert.strictEqual(docResult.summary.totalClasses, 1);
    assert.strictEqual(docResult.summary.totalFunctions, 1);
    assert.strictEqual(docResult.summary.totalApiEndpoints, 1);

    assert.strictEqual(docResult.classDocs[0].name, 'PaymentGateway');
    assert.strictEqual(docResult.functionDocs[0].name, 'processCharge');
    assert.strictEqual(docResult.functionDocs[0].params.length, 3);
    assert.ok(docResult.functionDocs[0].jsdoc.includes('@param'));
    assert.strictEqual(docResult.apiDocs[0].method, 'POST');
    assert.strictEqual(docResult.apiDocs[0].path, '/api/charges');
    assert.ok(docResult.markdownSummary.includes('# API & Code Documentation'));
    console.log('✅ Documentation engine accurately extracted classes, function JSDocs, and API endpoint documentation');

    // 2. API Endpoint Test
    const apiRes = await fetch(`${baseUrl}/reviews/docs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        code: sampleModule,
        language: 'javascript',
        fileName: 'payment.js'
      })
    }).then(r => r.json());

    assert.strictEqual(apiRes.success, true);
    assert.strictEqual(apiRes.summary.totalFunctions, 1);
    console.log('✅ POST /api/reviews/docs returned complete auto-generated documentation payload');

    console.log('\n🎉 ALL DAY 10 DOCUMENTATION GENERATOR TESTS PASSED!\n');
    server.close();
  } catch (err) {
    console.error('❌ Day 10 Test failed:', err);
    server.close();
    process.exit(1);
  }
}

runTests();
