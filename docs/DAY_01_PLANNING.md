# Day 1: Project Planning & Requirement Analysis

## 1. Project Mission & Objectives
The goal of the AI Code Review Assistant is to bridge the gap between static code linting and senior-level code reviews. It automates two critical stages of code inspection:
1. Fast, deterministic static code analysis (syntax, linting, security, duplication).
2. Cognitive AI-based code review (logic flaws, complexity, code smells, naming, and auto-generated docstrings).

## 2. Requirements & Scope Matrix

| Feature | Scope Status | Description |
| :--- | :--- | :--- |
| **Snippet Paste Input** | In Scope | Interactive Monaco code editor with syntax highlighting for JS, TS, Python, Java, C++, etc. |
| **File Upload Input** | In Scope | Drag-and-drop file upload using Multer supporting single & multi-file reviews. |
| **GitHub Repo URL** | Out of Scope | Per project requirements, marked as 'Not Working on' in curriculum. |
| **User Authentication** | In Scope | JWT-based auth (Register, Login, Password Reset, Profile Update). |
| **Database Schema** | In Scope | Relational tables for Users, Projects, Reviews, Review Findings. |
| **Static Code Analysis**| In Scope | AST parsing, style violations, security warnings, duplicate detection. |
| **AI Review Engine** | In Scope | Dual engine (LLM API + local deterministic fallback evaluator). |
| **Complexity Metrics** | In Scope | Cyclomatic complexity, LOC, function count, class count, quality score (0-100). |
| **Auto-Documentation** | In Scope | Automatic JSDoc/Docstring generator for classes, functions, and API endpoints. |
| **Review History** | In Scope | Historical review logs with search, filtering by date/severity/language, and deletion. |

## 3. System Architecture Diagram

```
+--------------------------------------------------------------------------+
|                            React Client (Vite)                          |
|  - Monaco Code Editor      - Static Analysis UI       - Recharts Dashboard|
|  - Drag & Drop Upload     - AI Review Summary        - Review History     |
+------------------------------------+-------------------------------------+
                                     |  HTTP REST + JWT Bearer
                                     v
+--------------------------------------------------------------------------+
|                          Express.js Server                               |
|  - Auth Routes (/api/auth)          - Review Routes (/api/reviews)       |
|  - Upload Routes (/api/upload)      - Project Routes (/api/projects)     |
+--------------------+-------------------------------+---------------------+
                     |                               |
                     v                               v
+-----------------------------+    +---------------------------------------+
|    Static Analysis Engine   |    |           AI Review Engine            |
|  - AST & Syntax Checker     |    |  - OpenAI / Gemini API Bridge         |
|  - Duplicate Code Detector  |    |  - Local Semantic Rule Fallback       |
|  - Security & Lint Linter   |    |  - Quality Score & Refactoring Engine |
|  - Cyclomatic Calculator    |    |  - Docstring & API Doc Generator      |
+-----------------------------+    +---------------------------------------+
                     \                               /
                      v                             v
+--------------------------------------------------------------------------+
|                      Relational Database (SQLite)                        |
|   Users  <--->  Projects  <--->  Reviews  <--->  Review Findings        |
+--------------------------------------------------------------------------+
```
