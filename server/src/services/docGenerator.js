/**
 * Auto-Documentation Generator
 * Generates JSDoc, Python Docstrings, Class Architecture, and REST API docs.
 */

export function generateDocumentation(code, language = 'javascript', fileName = 'code.js') {
  const lines = code ? code.split(/\r?\n/) : [];
  const normalizedLang = (language || 'javascript').toLowerCase();

  const functionDocs = extractFunctionDocs(lines, normalizedLang);
  const classDocs = extractClassDocs(lines, normalizedLang);
  const apiDocs = extractApiDocs(lines);

  // Generate Master Markdown Summary
  const markdownSummary = buildMasterMarkdown(fileName, normalizedLang, functionDocs, classDocs, apiDocs);

  return {
    success: true,
    fileName,
    language: normalizedLang,
    functionDocs,
    classDocs,
    apiDocs,
    markdownSummary,
    summary: {
      totalFunctions: functionDocs.length,
      totalClasses: classDocs.length,
      totalApiEndpoints: apiDocs.length
    }
  };
}

function extractFunctionDocs(lines, language) {
  const docs = [];

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    let name = null;
    let paramsStr = '';

    const jsMatch = line.match(/(?:async\s+)?function\s+([a-zA-Z0-9_$]+)\s*\(([^)]*)\)/);
    const arrowMatch = line.match(/(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*(?:async\s*)?\(([^)]*)\)\s*=>/);
    const pyMatch = line.match(/def\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\):/);

    if (jsMatch) {
      name = jsMatch[1];
      paramsStr = jsMatch[2];
    } else if (arrowMatch) {
      name = arrowMatch[1];
      paramsStr = arrowMatch[2];
    } else if (pyMatch) {
      name = pyMatch[1];
      paramsStr = pyMatch[2];
    }

    if (name) {
      const rawParams = paramsStr ? paramsStr.split(',').map(p => p.trim()).filter(Boolean) : [];
      const parsedParams = rawParams.map(param => {
        let pName = param;
        let pType = 'any';
        let isOptional = false;

        if (param.includes(':')) {
          const parts = param.split(':');
          pName = parts[0].trim();
          pType = parts[1].trim();
        } else if (param.includes('=')) {
          const parts = param.split('=');
          pName = parts[0].trim();
          isOptional = true;
          pType = isNaN(parts[1].trim()) ? 'string' : 'number';
        } else if (param.toLowerCase().includes('id')) {
          pType = 'string | number';
        } else if (param.toLowerCase().includes('is') || param.toLowerCase().includes('has')) {
          pType = 'boolean';
        } else if (param.toLowerCase().includes('arr') || param.toLowerCase().includes('items') || param.toLowerCase().includes('records')) {
          pType = 'Array<any>';
        } else if (param.toLowerCase().includes('req') || param.toLowerCase().includes('res')) {
          pType = 'Request / Response';
        }

        return {
          name: pName,
          type: pType,
          isOptional,
          description: `Input ${pName} parameter for processing.`
        };
      });

      const inferredReturn = name.startsWith('is') || name.startsWith('has') || name.startsWith('check')
        ? 'boolean'
        : name.startsWith('get') || name.startsWith('find')
        ? 'Object | null'
        : name.startsWith('calculate') || name.startsWith('count')
        ? 'number'
        : 'Promise<any> | any';

      // Standard JSDoc block
      const jsdoc = `/**
 * ${inferPurpose(name)}
 * 
${parsedParams.map(p => ` * @param {${p.type}} ${p.isOptional ? `[${p.name}]` : p.name} - ${p.description}`).join('\n')}
 * @returns {${inferredReturn}} Result of operation.
 */`;

      // Python Docstring block
      const pythonDoc = `"""
${inferPurpose(name)}

Args:
${parsedParams.map(p => `    ${p.name} (${p.type}): ${p.description}`).join('\n')}

Returns:
    ${inferredReturn}: Result of operation.
"""`;

      docs.push({
        name,
        line: lineNum,
        signature: `${name}(${rawParams.join(', ')})`,
        purpose: inferPurpose(name),
        params: parsedParams,
        returnType: inferredReturn,
        jsdoc,
        pythonDoc
      });
    }
  });

  return docs;
}

function extractClassDocs(lines, language) {
  const docs = [];

  lines.forEach((line, index) => {
    const match = line.match(/\bclass\s+([a-zA-Z0-9_]+)(?:\s+extends\s+([a-zA-Z0-9_]+))?/);
    if (match) {
      const className = match[1];
      const superClass = match[2] || null;

      docs.push({
        name: className,
        line: index + 1,
        superClass,
        purpose: `Encapsulates domain logic and business operations for ${className}.`,
        jsdoc: `/**
 * Represents the ${className} entity.
${superClass ? ` * @extends ${superClass}\n` : ''} * Encapsulates state and computational methods for ${className}.
 */`
      });
    }
  });

  return docs;
}

function extractApiDocs(lines) {
  const endpoints = [];

  lines.forEach((line, index) => {
    const match = line.match(/\b(?:app|router)\.(get|post|put|delete|patch)\s*\(\s*['"]([^'"]+)['"]/);
    if (match) {
      const method = match[1].toUpperCase();
      const path = match[2];

      endpoints.push({
        method,
        path,
        line: index + 1,
        description: `API endpoint handling ${method} requests to ${path}.`,
        requiresAuth: line.includes('authenticate') || line.includes('auth'),
        exampleResponse: {
          success: true,
          timestamp: new Date().toISOString()
        }
      });
    }
  });

  return endpoints;
}

function inferPurpose(funcName) {
  const words = funcName.replace(/([A-Z])/g, ' $1').toLowerCase();
  return `Executes ${words} and handles associated business logic.`;
}

function buildMasterMarkdown(fileName, language, funcs, classes, apis) {
  let md = `# API & Code Documentation: \`${fileName}\`\n\n`;
  md += `> Automatically generated by AI Code Review Assistant Documentation Engine.\n\n`;

  if (classes.length > 0) {
    md += `## 🏛️ Classes\n\n`;
    classes.forEach(c => {
      md += `### \`class ${c.name}\`\n`;
      if (c.superClass) md += `*Extends \`${c.superClass}\`*\n\n`;
      md += `${c.purpose}\n\n`;
      md += `\`\`\`${language}\n${c.jsdoc}\n\`\`\`\n\n`;
    });
  }

  if (funcs.length > 0) {
    md += `## ⚙️ Functions & Routines\n\n`;
    funcs.forEach(f => {
      md += `### \`${f.signature}\` (Line ${f.line})\n\n`;
      md += `${f.purpose}\n\n`;
      md += `| Parameter | Type | Description |\n`;
      md += `| :--- | :--- | :--- |\n`;
      f.params.forEach(p => {
        md += `| \`${p.name}\` | \`${p.type}\` | ${p.description} |\n`;
      });
      md += `\n**Returns:** \`${f.returnType}\`\n\n`;
      md += `#### Standard Documentation Block:\n`;
      md += `\`\`\`${language}\n${language.includes('python') ? f.pythonDoc : f.jsdoc}\n\`\`\`\n\n`;
    });
  }

  if (apis.length > 0) {
    md += `## 🌐 REST API Endpoints\n\n`;
    apis.forEach(api => {
      md += `### \`${api.method} ${api.path}\`\n\n`;
      md += `- **Auth Required:** ${api.requiresAuth ? 'Yes (Bearer JWT)' : 'No'}\n`;
      md += `- **Description:** ${api.description}\n\n`;
    });
  }

  return md;
}
