import assert from 'node:assert';
import app from '../src/server.js';
import { db } from '../src/db/database.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../src/config/jwt.js';

console.log('🧪 Starting Day 11 Review History, Search & Filter Tests...\n');

async function runTests() {
  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api`;

  try {
    const testUser = db.prepare('SELECT id, email FROM users LIMIT 1').get() || { id: 1, email: 'test@example.com' };
    const token = jwt.sign({ id: testUser.id, email: testUser.email }, JWT_SECRET, { expiresIn: '1h' });

    // 1. Fetch History List
    const listRes = await fetch(`${baseUrl}/reviews`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json());

    assert.strictEqual(listRes.success, true);
    assert.ok(Array.isArray(listRes.reviews), 'Returns reviews array');
    console.log(`✅ GET /api/reviews listed ${listRes.reviews.length} past reviews`);

    // 2. Search & Filter Query
    const searchRes = await fetch(`${baseUrl}/reviews?language=javascript`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json());

    assert.strictEqual(searchRes.success, true);
    searchRes.reviews.forEach(r => {
      assert.strictEqual(r.language.toLowerCase(), 'javascript');
    });
    console.log(`✅ Filter by language returned ${searchRes.reviews.length} matching reviews`);

    // 3. Delete Review
    if (listRes.reviews.length > 0) {
      const targetId = listRes.reviews[0].id;
      const deleteRes = await fetch(`${baseUrl}/reviews/${targetId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(r => r.json());

      assert.strictEqual(deleteRes.success, true);

      // Verify deletion in database
      const deleted = db.prepare('SELECT id FROM reviews WHERE id = ?').get(targetId);
      assert.strictEqual(deleted, undefined, 'Review should be removed from database');
      console.log(`✅ DELETE /api/reviews/${targetId} verified`);
    }

    console.log('\n🎉 ALL DAY 11 REVIEW HISTORY & FILTER TESTS PASSED!\n');
    server.close();
  } catch (err) {
    console.error('❌ Day 11 Test failed:', err);
    server.close();
    process.exit(1);
  }
}

runTests();
