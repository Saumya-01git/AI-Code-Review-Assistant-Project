import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testSuites = [
  'auth.test.js',
  'upload.test.js',
  'github.test.js',
  'static_analysis.test.js',
  'ai_review.test.js',
  'complexity.test.js',
  'docs.test.js',
  'history.test.js',
  'validation_errors.test.js'
];

console.log('====================================================');
console.log('🚀 RUNNING ALL MASTER END-TO-END AUTOMATED TEST SUITES');
console.log('====================================================\n');

let passed = 0;
let failed = 0;

for (const suite of testSuites) {
  const suitePath = path.resolve(__dirname, suite);
  console.log(`▶ Executing: ${suite}...`);
  try {
    execSync(`node "${suitePath}"`, { stdio: 'inherit' });
    passed++;
  } catch (err) {
    console.error(`❌ Suite failed: ${suite}`);
    failed++;
  }
}

console.log('\n====================================================');
console.log(`🏁 TEST SUMMARY: ${passed} PASSED | ${failed} FAILED | TOTAL: ${testSuites.length}`);
console.log('====================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL 9 TEST SUITES PASSED FLAWLESSLY!\n');
  process.exit(0);
}
