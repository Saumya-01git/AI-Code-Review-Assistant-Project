import * as espree from 'espree';

/**
 * Stage 1: Static Code Analysis Engine
 * Analyzes code for syntax errors, unused variables, styling violations,
 * formatting issues, duplicate blocks, and security warnings.
 */
export function analyzeStaticCode(code, language = 'javascript', fileName = 'code.js') {
  const findings = [];
  const lines = code ? code.split(/\r?\n/) : [];

  if (!code || !code.trim()) {
    return {
      success: true,
      stage: 'Static Code Analysis',
      findings: [{
        severity: 'warning',
        issue: 'Empty Source Code',
        explanation: 'No executable code was provided to analyze.',
        suggested_fix: 'Provide valid source code.',
        file_name: fileName,
        line_number: 1,
        rule: 'no-empty-source'
      }],
      summary: { totalIssues: 1, errors: 0, warnings: 1, infos: 0 }
    };
  }

  // 1. General Formatting & Style Checks
  checkFormatting(lines, fileName, findings);

  // 2. Duplicate Code Detection
  checkCodeDuplication(lines, fileName, findings);

  // 3. Language-Specific AST and Pattern Analysis
  const normalizedLang = (language || 'javascript').toLowerCase();

  if (['javascript', 'typescript', 'js', 'ts', 'jsx', 'tsx'].includes(normalizedLang)) {
    analyzeJavaScript(code, lines, fileName, findings);
  } else if (['python', 'py'].includes(normalizedLang)) {
    analyzePython(lines, fileName, findings);
  } else {
    analyzeGeneralLanguage(lines, fileName, findings);
  }

  const errors = findings.filter(f => f.severity === 'error').length;
  const warnings = findings.filter(f => f.severity === 'warning').length;
  const infos = findings.filter(f => f.severity === 'info').length;

  return {
    success: true,
    stage: 'Static Code Analysis',
    language: normalizedLang,
    fileName,
    lineCount: lines.length,
    findings,
    summary: {
      totalIssues: findings.length,
      errors,
      warnings,
      infos
    }
  };
}

// 1. Formatting and Indentation Validator
function checkFormatting(lines, fileName, findings) {
  let consecutiveEmptyLines = 0;

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // Trailing Whitespaces
    if (/[ \t]+$/.test(line)) {
      findings.push({
        severity: 'info',
        issue: 'Trailing Whitespace Detected',
        explanation: 'Line contains unnecessary trailing whitespace at the end.',
        suggested_fix: 'Remove trailing spaces or enable auto-trim on save.',
        file_name: fileName,
        line_number: lineNum,
        rule: 'no-trailing-spaces'
      });
    }

    // Excessive empty lines
    if (line.trim() === '') {
      consecutiveEmptyLines++;
      if (consecutiveEmptyLines === 3) {
        findings.push({
          severity: 'info',
          issue: 'Excessive Blank Lines',
          explanation: 'More than 2 consecutive empty lines reduce code readability.',
          suggested_fix: 'Keep at most 1-2 empty lines between declarations.',
          file_name: fileName,
          line_number: lineNum,
          rule: 'no-multiple-empty-lines'
        });
      }
    } else {
      consecutiveEmptyLines = 0;
    }

    // Line Length Check (> 120 chars)
    if (line.length > 130) {
      findings.push({
        severity: 'info',
        issue: 'Line Exceeds Maximum Recommended Length',
        explanation: `Line has ${line.length} characters (recommended max 120-130).`,
        suggested_fix: 'Break long statements or chain calls across multiple lines.',
        file_name: fileName,
        line_number: lineNum,
        rule: 'max-len'
      });
    }
  });
}

// 2. Duplicate Code Detector (Window-based hash comparison)
function checkCodeDuplication(lines, fileName, findings) {
  const minBlock = 4;
  if (lines.length < minBlock * 2) return;

  const sanitized = lines.map(l => l.trim().replace(/\s+/g, ' '));
  const seenBlocks = new Map();

  for (let i = 0; i <= sanitized.length - minBlock; i++) {
    const block = sanitized.slice(i, i + minBlock).join('\n');
    // Ignore trivial blocks of brackets/empty lines
    if (block.length > 25 && !/^[{}\s;()]+$/.test(block)) {
      if (seenBlocks.has(block)) {
        const prevLine = seenBlocks.get(block);
        findings.push({
          severity: 'warning',
          issue: 'Duplicate Code Block Detected',
          explanation: `Identical block of ${minBlock} lines found starting here and previously at line ${prevLine}.`,
          suggested_fix: 'Refactor duplicate logic into a reusable helper function or module.',
          file_name: fileName,
          line_number: i + 1,
          rule: 'no-duplicate-code'
        });
        break; // Report the primary duplication
      } else {
        seenBlocks.set(block, i + 1);
      }
    }
  }
}

// 3. JavaScript / TypeScript AST Static Analyzer (Espree / ESLint Parser)
function analyzeJavaScript(code, lines, fileName, findings) {
  let ast;
  try {
    ast = espree.parse(code, {
      ecmaVersion: 'latest',
      sourceType: 'module',
      loc: true,
      range: true
    });
  } catch (parseError) {
    // Exact syntax error reporting with line and column!
    const lineNum = parseError.lineNumber || 1;
    findings.unshift({
      severity: 'error',
      issue: 'Syntax Error (AST Parse Failure)',
      explanation: parseError.message || 'The parser encountered a fatal syntax error.',
      suggested_fix: 'Verify matching braces, brackets, correct keywords, or valid ECMAScript syntax.',
      file_name: fileName,
      line_number: lineNum,
      rule: 'parse-syntax-error'
    });
    return;
  }

  // AST Traversal for deep linting
  const declaredVars = new Map(); // name -> { line, used: boolean }
  const referencedVars = new Set();

  function walk(node, parent) {
    if (!node || typeof node !== 'object') return;

    // Rule: no-var (Style violation)
    if (node.type === 'VariableDeclaration' && node.kind === 'var') {
      findings.push({
        severity: 'warning',
        issue: 'Use of "var" Keyword',
        explanation: '"var" has function-scope and hoisting quirks that often lead to subtle bugs.',
        suggested_fix: 'Replace "var" with block-scoped "const" (preferable) or "let".',
        file_name: fileName,
        line_number: node.loc.start.line,
        rule: 'no-var'
      });
    }

    // Collect variable identifiers
    if (node.type === 'VariableDeclarator' && node.id && node.id.type === 'Identifier') {
      declaredVars.set(node.id.name, { line: node.loc.start.line, used: false });
    }

    // Track variable usage
    if (node.type === 'Identifier' && parent && parent.type !== 'VariableDeclarator') {
      referencedVars.add(node.name);
    }

    // Rule: eqeqeq (Loose equality check)
    if (node.type === 'BinaryExpression' && (node.operator === '==' || node.operator === '!=')) {
      findings.push({
        severity: 'warning',
        issue: `Loose Equality Operator "${node.operator}"`,
        explanation: `Using "${node.operator}" performs implicit type coercion, causing unexpected boolean evaluations.`,
        suggested_fix: `Replace "${node.operator}" with strict equality "${node.operator}=".`,
        file_name: fileName,
        line_number: node.loc.start.line,
        rule: 'eqeqeq'
      });
    }

    // Rule: no-eval / no-implied-eval (Security Warning)
    if (node.type === 'CallExpression' && node.callee && node.callee.name === 'eval') {
      findings.push({
        severity: 'error',
        issue: 'Critical Security Warning: eval() Detected',
        explanation: 'eval() executes arbitrary code strings and creates dangerous Remote Code Execution / XSS vectors.',
        suggested_fix: 'Refactor logic using native JSON.parse() or structured object mapping instead of eval().',
        file_name: fileName,
        line_number: node.loc.start.line,
        rule: 'no-eval'
      });
    }

    // Rule: no-console (Production Code Quality)
    if (
      node.type === 'CallExpression' &&
      node.callee &&
      node.callee.type === 'MemberExpression' &&
      node.callee.object &&
      node.callee.object.name === 'console' &&
      ['log', 'warn', 'info', 'debug'].includes(node.callee.property?.name)
    ) {
      findings.push({
        severity: 'info',
        issue: `Active "console.${node.callee.property.name}" Statement`,
        explanation: 'Console debugging statements left in production degrade performance and pollute logs.',
        suggested_fix: 'Remove console call or replace with a structured logging framework (e.g., Winston, Pino).',
        file_name: fileName,
        line_number: node.loc.start.line,
        rule: 'no-console'
      });
    }

    // Rule: no-debugger
    if (node.type === 'DebuggerStatement') {
      findings.push({
        severity: 'error',
        issue: 'Active "debugger" Statement',
        explanation: 'A debugger statement halts execution in running production environments.',
        suggested_fix: 'Remove the debugger statement.',
        file_name: fileName,
        line_number: node.loc.start.line,
        rule: 'no-debugger'
      });
    }

    // Security check: Hardcoded Secrets / Tokens
    if (node.type === 'Literal' && typeof node.value === 'string') {
      const val = node.value.toLowerCase();
      if (
        (val.includes('secret') || val.includes('apikey') || val.includes('api_key') || val.includes('password') || val.includes('bearer ')) &&
        node.value.length > 8 &&
        parent && parent.type === 'VariableDeclarator'
      ) {
        findings.push({
          severity: 'error',
          issue: 'Security Vulnerability: Possible Hardcoded Secret/Token',
          explanation: 'Sensitive API keys or credentials committed in plaintext leak easily to source control.',
          suggested_fix: 'Store credentials in environment variables (process.env.VAR) or secret vaults.',
          file_name: fileName,
          line_number: node.loc.start.line,
          rule: 'no-hardcoded-credentials'
        });
      }
    }

    // Rule: Empty catch block
    if (node.type === 'CatchClause' && node.body && node.body.body && node.body.body.length === 0) {
      findings.push({
        severity: 'warning',
        issue: 'Silent Exception (Empty Catch Block)',
        explanation: 'Ignoring caught errors hides runtime crashes and renders debugging difficult.',
        suggested_fix: 'Log the error or re-throw an informative custom exception.',
        file_name: fileName,
        line_number: node.loc.start.line,
        rule: 'no-empty-catch'
      });
    }

    // Recurse children
    for (const key in node) {
      if (key !== 'parent' && node[key]) {
        if (Array.isArray(node[key])) {
          node[key].forEach(child => walk(child, node));
        } else if (typeof node[key] === 'object') {
          walk(node[key], node);
        }
      }
    }
  }

  walk(ast, null);

  // Check for unused variables
  for (const [varName, info] of declaredVars.entries()) {
    if (!referencedVars.has(varName) && !varName.startsWith('_')) {
      findings.push({
        severity: 'warning',
        issue: `Unused Variable "${varName}"`,
        explanation: `Variable "${varName}" is declared at line ${info.line} but never read.`,
        suggested_fix: `Remove "${varName}" or prefix with an underscore if required by an interface.`,
        file_name: fileName,
        line_number: info.line,
        rule: 'no-unused-vars'
      });
    }
  }
}

// 4. Python Static Analyzer
function analyzePython(lines, fileName, findings) {
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();

    // Bare except clause
    if (/^except\s*:/.test(trimmed)) {
      findings.push({
        severity: 'warning',
        issue: 'Bare "except:" Clause in Python',
        explanation: 'A bare except catches SystemExit, KeyboardInterrupt, and all unexpected errors, masking real issues.',
        suggested_fix: 'Catch specific exceptions (e.g. "except Exception as e:" or "except ValueError:").',
        file_name: fileName,
        line_number: lineNum,
        rule: 'no-bare-except'
      });
    }

    // Mutable default argument in def
    if (/def\s+\w+\(.*=\s*(\[\]|\{\})\s*\):/.test(trimmed)) {
      findings.push({
        severity: 'warning',
        issue: 'Mutable Default Argument in Function Definition',
        explanation: 'Default mutable arguments (lists or dicts) are shared across all calls to the function.',
        suggested_fix: 'Use None as default (e.g. def func(items=None): if items is None: items = []).',
        file_name: fileName,
        line_number: lineNum,
        rule: 'no-mutable-default-args'
      });
    }

    // Print statements in production code
    if (/^print\s*\(/.test(trimmed)) {
      findings.push({
        severity: 'info',
        issue: 'Active "print()" Call Detected',
        explanation: 'Print statements clutter stdout and lack log-level categorization.',
        suggested_fix: 'Use Python logging module ("logging.info()" or "logging.debug()").',
        file_name: fileName,
        line_number: lineNum,
        rule: 'no-print'
      });
    }

    // Hardcoded secrets
    if (/(api_key|secret|password|auth_token)\s*=\s*['"][^'"]{8,}['"]/i.test(trimmed)) {
      findings.push({
        severity: 'error',
        issue: 'Security Vulnerability: Possible Hardcoded Secret',
        explanation: 'Hardcoded credentials in Python scripts leak credentials into git logs.',
        suggested_fix: 'Use os.environ.get("SECRET_KEY") or a .env file.',
        file_name: fileName,
        line_number: lineNum,
        rule: 'no-hardcoded-credentials'
      });
    }
  });
}

// 5. General Language Analyzer
function analyzeGeneralLanguage(lines, fileName, findings) {
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();

    // Hardcoded tokens or passwords
    if (/(password|secret|api_key|token)\s*[:=]\s*["'][^"']{8,}["']/i.test(trimmed)) {
      findings.push({
        severity: 'error',
        issue: 'Potential Hardcoded Secret',
        explanation: 'Detected credential pattern in code.',
        suggested_fix: 'Store credentials in environment variables.',
        file_name: fileName,
        line_number: lineNum,
        rule: 'no-hardcoded-credentials'
      });
    }

    // TODO comments
    if (/\b(TODO|FIXME|HACK|XXX)\b/i.test(trimmed)) {
      findings.push({
        severity: 'info',
        issue: 'Unresolved Developer Comment (TODO/FIXME)',
        explanation: 'Code contains an unresolved developer marker.',
        suggested_fix: 'Address the TODO item before final production deployment.',
        file_name: fileName,
        line_number: lineNum,
        rule: 'no-todo'
      });
    }
  });
}
