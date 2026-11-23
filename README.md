# AI Code Review Assistant 🚀

> An intelligent, full-stack automated code review platform that combines static code analysis and AI-powered reasoning to detect bugs, code smells, security vulnerabilities, and complexity metrics.

---

## 📋 Project Overview

The **AI Code Review Assistant** provides developers, students, and teams with instant, deep feedback on source code before peer review or production deployment.

### Two-Stage Review Pipeline:
1. **Stage 1: Static Code Analysis**
   - AST & Syntax error detection
   - Unused variables & dead code
   - Missing imports & undefined references
   - Code duplication detection
   - Formatting & style violations (ESLint / PEP8 conventions)
   - Common security flaws (injections, unsafe regex, hardcoded secrets)
2. **Stage 2: AI-Powered Deep Review & Metrics**
   - Bug risk detection & root cause explanation
   - Code smell classification (High, Medium, Low severity)
   - Cyclomatic, Function, and File complexity analysis
   - Better naming & performance optimization suggestions
   - Auto-generated function, class, and API documentation
   - Code quality score (0–100) with actionable refactoring advice

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, Monaco Editor, Recharts |
| **Backend** | Node.js, Express.js, Multer, JWT, Bcrypt |
| **Database** | SQLite (Relational SQL Schema for Users, Projects, Reviews, Findings) |
| **Static Analysis** | Multi-rule AST Engine, ESLint rules, Cyclomatic Complexity Analyzer |
| **AI Integration** | OpenAI / Gemini API compatible engine with smart offline fallback analyzer |

---

## 🗓️ 14-Day Development Schedule

- [x] **Day 1**: Project planning, requirement analysis, UI wireframes, Git repository setup
- [x] **Day 2**: Design database schema and implement user authentication (JWT + bcrypt)
- [x] **Day 3**: Build dashboard layout, navigation, and routing
- [x] **Day 4**: Implement code snippet upload and storage
- [x] **Day 5**: GitHub Repository API notes & architecture
- [x] **Day 6**: Integrate static code analysis tools (ESLint / AST rules)
- [x] **Day 7**: Display static analysis results in a structured dashboard
- [x] **Day 8**: Integrate AI model for code review and explanation
- [x] **Day 9**: Add complexity analysis and code smell reporting
- [x] **Day 10**: Generate documentation for functions, classes, and APIs
- [x] **Day 11**: Implement review history, search, and filtering
- [x] **Day 12**: Testing, debugging, validation, and error handling
- [x] **Day 13**: Improve UI/UX, optimize performance, and refactor code
- [x] **Day 14**: Deploy the application, prepare documentation, and present the project

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Setup & Installation
```bash
# Clone the repository
git clone https://github.com/Saumya-01git/AI-Code-Review-Assistant-Project.git
cd AI-Code-Review-Assistant-Project

# Install dependencies (Root, Server, and Client)
npm install
cd server && npm install
cd ../client && npm install
cd ..

# Run both backend & frontend concurrently
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`
