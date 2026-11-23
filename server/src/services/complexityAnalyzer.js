/**
 * Complexity Analysis & Code Smell Reporting Engine
 * Computes:
 * - Cyclomatic Complexity
 * - Function-level Complexity
 * - File Complexity Rating
 * - Number of Functions
 * - Number of Classes
 * - Lines of Code (LOC, SLOC, Comments, Blank)
 * - Code Smells (Long method, deep nesting, magic numbers, parameter bloat, etc.)
 */

export function analyzeComplexity(code, language = 'javascript', fileName = 'code.js') {
  const lines = code ? code.split(/\r?\n/) : [];
  
  // 1. Line Metrics
  let blankLines = 0;
  let commentLines = 0;
  let sourceLines = 0;

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) {
      blankLines++;
    } else if (trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      commentLines++;
    } else {
      sourceLines++;
    }
  });

  // 2. Classes Detection
  const classMatches = code.match(/\bclass\s+([a-zA-Z0-9_]+)/g) || [];
  const classes = classMatches.map(c => c.replace(/\bclass\s+/, ''));

  // 3. Functions Extraction & Per-Function Complexity
  const functionList = extractFunctions(code, lines, language);

  // 4. File-wide Cyclomatic Complexity (Decision Points + 1)
  let decisionPoints = 0;
  const decisionRegex = /\b(if|else\s+if|elif|for|while|case|catch)\b|(&&|\|\|)|\?\s*[^:]+\s*:/g;
  const matches = code.match(decisionRegex);
  if (matches) {
    decisionPoints = matches.length;
  }
  const fileCyclomatic = Math.max(1, decisionPoints + 1);

  // Determine File Complexity Level
  let fileComplexityRating = 'Low Risk (Simple)';
  let complexityColor = 'emerald';
  if (fileCyclomatic > 15) {
    fileComplexityRating = 'High Risk (Complex)';
    complexityColor = 'rose';
  } else if (fileCyclomatic > 7) {
    fileComplexityRating = 'Moderate Risk (Manageable)';
    complexityColor = 'amber';
  }

  // 5. Code Smell Detection
  const codeSmells = detectCodeSmells(code, lines, functionList, fileName);

  return {
    success: true,
    fileName,
    language,
    metrics: {
      linesOfCode: lines.length,
      sourceLines,
      commentLines,
      blankLines,
      functionsCount: functionList.length,
      classesCount: classes.length,
      classesList: classes
    },
    cyclomaticComplexity: {
      score: fileCyclomatic,
      rating: fileComplexityRating,
      color: complexityColor,
      decisionPoints
    },
    functionComplexity: functionList,
    codeSmells,
    summary: {
      totalSmells: codeSmells.length,
      highRiskSmells: codeSmells.filter(s => s.severity === 'high').length,
      mediumRiskSmells: codeSmells.filter(s => s.severity === 'medium').length,
      lowRiskSmells: codeSmells.filter(s => s.severity === 'low').length
    }
  };
}

function extractFunctions(code, lines, language) {
  const functions = [];
  
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    let funcName = null;

    // JavaScript / TypeScript function patterns
    const jsFunc = line.match(/(?:async\s+)?function\s+([a-zA-Z0-9_$]+)\s*\(([^)]*)\)/);
    const arrowFunc = line.match(/(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*(?:async\s*)?\(([^)]*)\)\s*=>/);
    const methodFunc = line.match(/^\s*(?:async\s+)?([a-zA-Z0-9_$]+)\s*\(([^)]*)\)\s*\{/);
    
    // Python def pattern
    const pyFunc = line.match(/def\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\):/);

    let params = '';
    if (jsFunc) {
      funcName = jsFunc[1];
      params = jsFunc[2];
    } else if (arrowFunc) {
      funcName = arrowFunc[1];
      params = arrowFunc[2];
    } else if (pyFunc) {
      funcName = pyFunc[1];
      params = pyFunc[2];
    } else if (methodFunc && !['if', 'while', 'for', 'switch', 'catch'].includes(methodFunc[1])) {
      funcName = methodFunc[1];
      params = methodFunc[2];
    }

    if (funcName) {
      // Estimate function body length
      let funcLines = 1;
      let funcDecisions = 0;
      let depth = 0;
      let started = false;

      for (let j = index; j < lines.length; j++) {
        funcLines++;
        const current = lines[j];

        if (current.includes('{')) depth++;
        if (current.includes('}')) depth--;

        if (depth > 0) started = true;

        if (/\b(if|for|while|case|catch|elif)\b|(&&|\|\|)/.test(current)) {
          funcDecisions++;
        }

        if (started && depth <= 0) break;
        if (language.includes('python') && j > index && lines[j].trim() && !lines[j].startsWith('    ') && !lines[j].startsWith('\t')) {
          break;
        }
      }

      const cyclomatic = funcDecisions + 1;
      let risk = 'Low';
      if (cyclomatic > 10) risk = 'High';
      else if (cyclomatic > 5) risk = 'Moderate';

      const paramCount = params ? params.split(',').filter(p => p.trim()).length : 0;

      functions.push({
        name: funcName,
        line: lineNum,
        linesCount: funcLines,
        cyclomaticComplexity: cyclomatic,
        risk,
        parameterCount: paramCount
      });
    }
  });

  return functions;
}

function detectCodeSmells(code, lines, functions, fileName) {
  const smells = [];

  // Smell 1: Long Parameter List (> 4 parameters)
  functions.forEach(fn => {
    if (fn.parameterCount > 3) {
      smells.push({
        severity: 'medium',
        issue: `Long Parameter List: "${fn.name}"`,
        explanation: `Function accepts ${fn.parameterCount} parameters. Functions with more than 3-4 arguments have high coupling and cognitive load.`,
        suggested_fix: 'Group related parameters into a single configuration options object or data transfer object (DTO).',
        file_name: fileName,
        line_number: fn.line,
        smellType: 'Long Parameter List'
      });
    }

    // Smell 2: Large / Bloated Function (> 35 lines)
    if (fn.linesCount > 35) {
      smells.push({
        severity: 'high',
        issue: `Large Function (God Method): "${fn.name}"`,
        explanation: `Function is ${fn.linesCount} lines long. Large functions violate the Single Responsibility Principle and are difficult to unit-test.`,
        suggested_fix: 'Decompose this function into smaller, single-purpose helper functions.',
        file_name: fileName,
        line_number: fn.line,
        smellType: 'Large Function'
      });
    }

    // Smell 3: High Cyclomatic Complexity
    if (fn.cyclomaticComplexity > 8) {
      smells.push({
        severity: 'high',
        issue: `Complex Function Branching: "${fn.name}"`,
        explanation: `Function has a cyclomatic complexity of ${fn.cyclomaticComplexity}, requiring at least ${fn.cyclomaticComplexity} unit test paths for full branch coverage.`,
        suggested_fix: 'Simplify conditional logic using guard clauses, early returns, or polymorphism.',
        file_name: fileName,
        line_number: fn.line,
        smellType: 'High Cyclomatic Complexity'
      });
    }
  });

  // Smell 4: Deeply Nested Control Flow (Nesting depth >= 3)
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const indentMatch = line.match(/^(\s+)/);
    if (indentMatch) {
      const spaces = indentMatch[1].replace(/\t/g, '    ').length;
      if (spaces >= 12 && /\b(if|for|while|switch)\b/.test(line)) {
        smells.push({
          severity: 'medium',
          issue: 'Deeply Nested Control Flow',
          explanation: `Line has a nesting depth of ${Math.floor(spaces / 4)} levels ("Pyramid of Doom").`,
          suggested_fix: 'Flatten hierarchy using early returns, guard clauses, or extracting inner loops into standalone helpers.',
          file_name: fileName,
          line_number: lineNum,
          smellType: 'Deep Nesting'
        });
      }
    }
  });

  // Smell 5: Magic Numbers (Hardcoded literal numbers without named constants)
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();
    if (!trimmed.startsWith('//') && !trimmed.startsWith('*')) {
      const magicMatch = trimmed.match(/[=><+\-*\/]\s*([1-9][0-9]{2,})\b/);
      if (magicMatch && !trimmed.includes('PORT') && !trimmed.includes('200') && !trimmed.includes('404') && !trimmed.includes('500') && !trimmed.includes('1000')) {
        smells.push({
          severity: 'low',
          issue: `Magic Number "${magicMatch[1]}" Detected`,
          explanation: 'Using raw numbers directly in algorithmic computations obscures business intent.',
          suggested_fix: `Extract "${magicMatch[1]}" into a descriptive named constant (e.g. const MAX_THRESHOLD = ${magicMatch[1]}).`,
          file_name: fileName,
          line_number: lineNum,
          smellType: 'Magic Number'
        });
      }
    }
  });

  return smells;
}
