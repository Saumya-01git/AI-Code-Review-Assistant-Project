import assert from 'node:assert';
import app from '../src/server.js';
import { db } from '../src/db/database.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../src/config/jwt.js';

console.log('🧪 Starting Day 5 GitHub Integration Architecture Tests...\n');

async function runTests() {
  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api`;

  try {
    const testUser = db.prepare('SELECT id, email FROM users LIMIT 1').get() || { id: 1, email: 'test@example.com' };
    const token = jwt.sign({ id: testUser.id, email: testUser.email }, JWT_SECRET, { expiresIn: '1h' });

    // Test GitHub URL inspection endpoint
    const res = await fetch(`${baseUrl}/github/inspect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        githubUrl: 'https://github.com/Saumya-01git/AI-Code-Review-Assistant-Project'
      })
    }).then(r => r.json());

    assert.strictEqual(res.success, true);
    assert.strictEqual(res.repository.owner, 'Saumya-01git');
    assert.strictEqual(res.repository.repo, 'AI-Code-Review-Assistant-Project');
    console.log('✅ GitHub URL parser & educational architectural handler passed');

    console.log('\n🎉 ALL DAY 5 GITHUB ARCHITECTURE TESTS PASSED!\n');
    server.close();
  } catch (err) {
    console.error('❌ Day 5 Test failed:', err);
    server.close();
    process.exit(1);
  }
}

runTests();
