# AI Code Review Assistant 🚀

> An intelligent, full-stack automated code quality workstation combining Stage 1 Static AST Linting and Stage 2 AI Semantic Reasoning to detect security vulnerabilities, syntax flaws, code smells, and cyclomatic complexity with auto-generated documentation and a world-class 5-color radiant UI.

[![Node.js](https://img.shields.io/badge/Node.js-v24_LTS-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![SQLite](https://img.shields.io/badge/SQLite-native-003B57.svg)](https://sqlite.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.4-38B2AC.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🎨 5-Color Radiant Theme & AI Guardian

The UI features a strictly curated 5-color aesthetic inspired by modern design palettes:
- **Sand**: `#C1AE7C`
- **Bubblegum Pink**: `#E16F7C`
- **Sweet Peony**: `#DD5E98`
- **Vivid Orchid**: `#CC4BC2`
- **Blackberry Cream**: `#6C3A5C`

### 🌟 Interactive Corner Square AI Guardian:
Positioned at the bottom corner touching the window edges with an animated moving light mesh background, dynamic star shining sparkles (`animate-star-shine`), and real-time status telemetry of both Stage 1 (AST Linter) and Stage 2 (AI Reasoning) engines.

---

## 📋 Comprehensive 14-Day Curriculum Milestones

All 14 days of the internship curriculum have been implemented, verified, and committed with zero technical debt:

- [x] **Day 1**: Project planning, architectural specifications, UI wireframes, Git repository setup ([DAY_01_PLANNING.md](docs/DAY_01_PLANNING.md), [WIREFRAMES.md](docs/WIREFRAMES.md))
- [x] **Day 2**: Database schema with SQLite (`node:sqlite`) and JWT auth with bcrypt ([DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md))
- [x] **Day 3**: Dashboard layout, navigation sidebar, theme toggle, and auth routing
- [x] **Day 4**: Monaco code editor snippet input, presets, and Multer multi-file upload
- [x] **Day 5**: GitHub Repository integration architecture & educational inspector endpoint ([DAY_05_GITHUB_INTEGRATION_ARCH.md](docs/DAY_05_GITHUB_INTEGRATION_ARCH.md))
- [x] **Day 6**: Stage 1 Static Code Analysis AST Engine (ESLint rules, security credentials check, loose equality, eval detector)
- [x] **Day 7**: Static analysis interactive results dashboard with severity filtering and line jumping in Monaco
- [x] **Day 8**: Stage 2 AI code review engine (code explanation, bug detection, naming suggestions, refactoring)
- [x] **Day 9**: Cyclomatic complexity metrics ($M = E - N + 2P$), LOC, function breakdown, and code smell heuristics
- [x] **Day 10**: Auto-documentation generator for functions (JSDoc/Docstring), classes, and REST APIs
- [x] **Day 11**: Review history listing, live keyword search, language filtering, and deletion
- [x] **Day 12**: Centralized validation, error boundaries, and master test runner (`run_tests.js`)
- [x] **Day 13**: ThemeProvider (Dark/Light mode), Recharts analytics area charts, and responsive UX
- [x] **Day 14**: Cloud deployment configs (`render.yaml`, `vercel.json`, `Dockerfile`), API reference ([API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)), and test cases ([SAMPLE_TEST_CASES.md](docs/SAMPLE_TEST_CASES.md))

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Monaco Editor, Recharts, Lucide Icons |
| **Backend** | Node.js 24, Express, Native `node:sqlite`, JWT (`jsonwebtoken`), Bcrypt |
| **Static Linter (Stage 1)** | Espree AST Parser, Security checks, ESLint rules, Python AST parser |
| **AI Intelligence (Stage 2)** | Gemini / OpenAI API integration + local cognitive semantic fallback |
| **DevOps & Cloud** | Docker, Render Blueprint (`render.yaml`), Vercel (`vercel.json`) |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or v24 recommended)
- npm or pnpm

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/Saumya-01git/AI-Code-Review-Assistant-Project.git
cd AI-Code-Review-Assistant-Project

# Install all dependencies (root, server, client)
npm run install:all
```

### 2. Development Mode
```bash
# Launch backend (port 5000) and frontend (port 5173) concurrently
npm run dev
```

- **Frontend URL**: `http://localhost:5173`
- **Backend API URL**: `http://localhost:5000/api`

### 3. Demo Credentials
You can click the **One-Click Demo Login** button on `/login` or enter:
- **Email**: `saumya@example.com`
- **Password**: `developer123`

---

## 🧪 Automated Master Test Suite

The platform includes 9 automated test suites verifying all backend endpoints, AST rules, AI reasoning, complexity calculation, and auth flows:

```bash
node server/tests/run_tests.js
```

**Expected Test Output**:
```
====================================================
🚀 RUNNING ALL MASTER END-TO-END AUTOMATED TEST SUITES
====================================================
▶ Executing: auth.test.js...                ✅ 8/8 PASSED
▶ Executing: upload.test.js...              ✅ 2/2 PASSED
▶ Executing: github.test.js...              ✅ 1/1 PASSED
▶ Executing: static_analysis.test.js...     ✅ 4/4 PASSED
▶ Executing: ai_review.test.js...           ✅ 2/2 PASSED
▶ Executing: complexity.test.js...          ✅ 2/2 PASSED
▶ Executing: docs.test.js...                ✅ 2/2 PASSED
▶ Executing: history.test.js...             ✅ 3/3 PASSED
▶ Executing: validation_errors.test.js...   ✅ 6/6 PASSED
====================================================
🏁 TEST SUMMARY: 9 PASSED | 0 FAILED | TOTAL: 9
🎉 ALL 9 TEST SUITES PASSED FLAWLESSLY!
====================================================
```

---

## 📚 Documentation Links
- [REST API Documentation](docs/API_DOCUMENTATION.md)
- [Sample Test Cases & Benchmarks](docs/SAMPLE_TEST_CASES.md)
- [Cloud Deployment Guide](docs/DEPLOYMENT_GUIDE.md)
- [Database Schema Specification](docs/DATABASE_SCHEMA.md)
- [GitHub Integration Architecture](docs/DAY_05_GITHUB_INTEGRATION_ARCH.md)

---

## 📄 License
MIT License. Developed as an advanced full-stack AI engineering platform.
