import assert from 'node:assert';
import app from '../src/server.js';

console.log('🧪 Starting Day 12 Validation & Error Handling Tests...\n');

async function runTests() {
  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api`;

  try {
    // 1. Invalid Registration (Short password)
    const shortPassRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test', email: 'test_short@example.com', password: '123' })
    });
    assert.strictEqual(shortPassRes.status, 400);
    const shortData = await shortPassRes.json();
    assert.strictEqual(shortData.success, false);
    console.log('✅ Short password correctly rejected with 400 Bad Request');

    // 2. Invalid Login (Wrong password)
    const wrongPassRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'saumya@example.com', password: 'wrongpassword' })
    });
    assert.strictEqual(wrongPassRes.status, 401);
    const wrongData = await wrongPassRes.json();
    assert.strictEqual(wrongData.success, false);
    console.log('✅ Invalid password correctly rejected with 401 Unauthorized');

    // 3. Protected endpoint without Authorization header
    const noAuthRes = await fetch(`${baseUrl}/auth/me`);
    assert.strictEqual(noAuthRes.status, 401);
    console.log('✅ Unauthenticated request correctly rejected with 401');

    // 4. Protected endpoint with forged token
    const badTokenRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { 'Authorization': 'Bearer forged.invalid.token' }
    });
    assert.strictEqual(badTokenRes.status, 403);
    console.log('✅ Forged token correctly rejected with 403 Forbidden');

    // 5. Code Review with empty code string
    // Register temporary user for auth token
    const tempEmail = `err_test_${Date.now()}@example.com`;
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Error Tester', email: tempEmail, password: 'password123' })
    }).then(r => r.json());

    const emptyCodeRes = await fetch(`${baseUrl}/reviews/static`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${regRes.token}`
      },
      body: JSON.stringify({ code: '   ' })
    });
    assert.strictEqual(emptyCodeRes.status, 400);
    console.log('✅ Empty code payload correctly rejected with 400');

    // 6. Non-existent route 404 handler
    const notFoundRes = await fetch(`${baseUrl}/non_existent_route`);
    assert.strictEqual(notFoundRes.status, 404);
    const notFoundData = await notFoundRes.json();
    assert.strictEqual(notFoundData.success, false);
    console.log('✅ 404 handler returns structured JSON error message');

    console.log('\n🎉 ALL DAY 12 VALIDATION & ERROR HANDLING TESTS PASSED!\n');
    server.close();
  } catch (err) {
    console.error('❌ Day 12 Test failed:', err);
    server.close();
    process.exit(1);
  }
}

runTests();
