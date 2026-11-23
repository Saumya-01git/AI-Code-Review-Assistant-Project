import assert from 'node:assert';
import app from '../src/server.js';
import { db } from '../src/db/database.js';

console.log('🧪 Starting Day 2 Authentication & Database Tests...\n');

async function runTests() {
  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api`;

  try {
    // 1. Health check
    const healthRes = await fetch(`${baseUrl}/health`).then(r => r.json());
    assert.strictEqual(healthRes.status, 'ok', 'Health check should return ok');
    console.log('✅ Health check passed');

    // 2. User Registration
    const testUser = {
      name: 'Saumya Developer',
      email: `saumya_${Date.now()}@example.com`,
      password: 'password123'
    };

    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    }).then(r => r.json());

    assert.strictEqual(regRes.success, true, 'Registration should be successful');
    assert.ok(regRes.token, 'Registration should return JWT token');
    assert.strictEqual(regRes.user.email, testUser.email);
    console.log('✅ User registration with bcrypt hashing passed');

    // 3. User Login
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, password: testUser.password })
    }).then(r => r.json());

    assert.strictEqual(loginRes.success, true, 'Login should succeed with valid credentials');
    assert.ok(loginRes.token, 'Login should return JWT');
    const token = loginRes.token;
    console.log('✅ User login and JWT issuance passed');

    // 4. Protected Route: /api/auth/me
    const meRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json());

    assert.strictEqual(meRes.success, true, 'Protected /auth/me should succeed with valid token');
    assert.strictEqual(meRes.user.email, testUser.email);
    console.log('✅ Protected route verification with Bearer token passed');

    // 5. Profile Update
    const updateRes = await fetch(`${baseUrl}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name: 'Saumya Lead Engineer' })
    }).then(r => r.json());

    assert.strictEqual(updateRes.success, true);
    assert.strictEqual(updateRes.user.name, 'Saumya Lead Engineer');
    console.log('✅ Profile update passed');

    // 6. Forgot Password Token & Reset Password Flow
    const forgotRes = await fetch(`${baseUrl}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email })
    }).then(r => r.json());

    assert.strictEqual(forgotRes.success, true);
    assert.ok(forgotRes.resetToken, 'Reset token generated');
    console.log('✅ Forgot password token generation passed');

    const resetRes = await fetch(`${baseUrl}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resetToken: forgotRes.resetToken, newPassword: 'newpassword456' })
    }).then(r => r.json());

    assert.strictEqual(resetRes.success, true);
    console.log('✅ Password reset with token passed');

    // 7. Verify login with new password
    const reLogin = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, password: 'newpassword456' })
    }).then(r => r.json());

    assert.strictEqual(reLogin.success, true);
    console.log('✅ Login with updated password verified');

    console.log('\n🎉 ALL DAY 2 DATABASE & AUTHENTICATION TESTS PASSED!\n');
    process.exit(0);
  } finally {
    server.close();
  }
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
