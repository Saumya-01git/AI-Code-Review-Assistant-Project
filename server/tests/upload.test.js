import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import app from '../src/server.js';
import { db } from '../src/db/database.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../src/config/jwt.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Starting Day 4 Snippet & Multer File Upload Tests...\n');

async function runTests() {
  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api`;

  try {
    // Generate auth token for testing
    const testUser = db.prepare('SELECT id, email FROM users LIMIT 1').get() || { id: 1, email: 'test@example.com' };
    const token = jwt.sign({ id: testUser.id, email: testUser.email }, JWT_SECRET, { expiresIn: '1h' });

    // 1. Test Snippet Storage API
    const snippetPayload = {
      title: 'Bubble Sort Test',
      code: 'function bubbleSort(arr) {\n  return arr.sort();\n}',
      language: 'javascript'
    };

    const snippetRes = await fetch(`${baseUrl}/snippets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(snippetPayload)
    }).then(r => r.json());

    assert.strictEqual(snippetRes.success, true);
    assert.strictEqual(snippetRes.snippet.language, 'javascript');
    assert.strictEqual(snippetRes.snippet.lineCount, 3);
    console.log('✅ Snippet storage endpoint passed');

    // 2. Test Multer File Upload with simulated multipart request
    const dummyFilePath = path.join(__dirname, 'sample_code.js');
    fs.writeFileSync(dummyFilePath, 'const sum = (a, b) => a + b;\nconsole.log(sum(2, 3));\n');

    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    const fileContent = fs.readFileSync(dummyFilePath, 'utf8');

    const bodyParts = [
      `--${boundary}\r\n`,
      'Content-Disposition: form-data; name="files"; filename="sample_code.js"\r\n',
      'Content-Type: text/javascript\r\n\r\n',
      fileContent,
      `\r\n--${boundary}--\r\n`
    ];
    const multipartBody = bodyParts.join('');

    const uploadRes = await fetch(`${baseUrl}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Authorization': `Bearer ${token}`
      },
      body: multipartBody
    }).then(r => r.json());

    fs.unlinkSync(dummyFilePath);

    assert.strictEqual(uploadRes.success, true);
    assert.strictEqual(uploadRes.files.length, 1);
    assert.strictEqual(uploadRes.files[0].originalName, 'sample_code.js');
    assert.strictEqual(uploadRes.files[0].language, 'javascript');
    assert.ok(uploadRes.files[0].content.includes('const sum'));
    console.log('✅ Multer multi-file upload and storage endpoint passed');

    console.log('\n🎉 ALL DAY 4 FILE UPLOAD & SNIPPET STORAGE TESTS PASSED!\n');
    server.close();
  } catch (err) {
    console.error('❌ Day 4 Test failed:', err);
    server.close();
    process.exit(1);
  }
}

runTests();
