# UI/UX Wireframes & User Journey Specification

## 1. Visual Hierarchy & Theme
- **Color Palette**: Professional Developer Dark/Slate theme with vibrant accents:
  - Background: Slate 950 (`#020617`) and Slate 900 (`#0f172a`)
  - Primary Accent: Indigo 500 (`#6366f1`) and Cyan 500 (`#06b6d4`)
  - Severity Badges:
    - Critical / Error: Rose 500 (`#f43f5e`)
    - Warning: Amber 500 (`#f59e0b`)
    - Info / Suggestion: Sky 500 (`#0284c7`)
    - Success: Emerald 500 (`#10b981`)
- **Typography**: Clean Inter / System UI with JetBrains Mono / Fira Code for code blocks.

---

## 2. Page Wireframes

### Screen 1: Landing & Auth (`/login`, `/register`, `/forgot-password`)
- Modern split view or glassmorphic centered card with tab switching between Sign In & Sign Up.
- Live validation, demo quick-login credentials, and password visibility toggle.

### Screen 2: Dashboard Overview (`/dashboard`)
- Top Navigation: Logo, Review Code CTA, History, Documentation, Profile avatar with dropdown.
- Quick Stats: Total Reviews, Average Code Quality Score, Total Bugs Prevented, Languages Analyzed.
- Quick Review Widget: Drop a file or paste code directly.
- Recent Reviews Feed: Interactive table with score badges, timestamp, language, and "View Report" button.

### Screen 3: Code Review Studio (`/review`)
- Split / Tabbed View:
  - Tab A: Monaco Code Editor with language selector (JavaScript, TypeScript, Python, HTML/CSS, Java, C++).
  - Tab B: Drag-and-drop file uploader with preview of file size and lines.
  - Review Options: Select Analysis Depth (Static Only, AI Review, Full Suite).
- Analyze Button: Animated progress indicator through Stage 1 (Static) and Stage 2 (AI).

### Screen 4: Review Report Dashboard (`/reviews/:id`)
- **Executive Summary Header**: Overall Score (0-100 Gauge), Quality Grade (A+, A, B, C, F), Severity Breakdown.
- **Complexity Metrics Cards**: Cyclomatic Complexity, Lines of Code, Number of Functions, Number of Classes.
- **Stage 1 Tab (Static Analysis)**: Syntax errors, unused variables, formatting, style violations with line numbers.
- **Stage 2 Tab (AI Review)**: Root-cause bug analysis, security vulnerabilities, naming suggestions, refactoring code diff.
- **Stage 3 Tab (Auto Docs)**: Clean Markdown & JSDoc generated summaries for every detected function/class.
- **Action Buttons**: Export as JSON / Markdown, Copy to Clipboard, Re-analyze, Delete.

### Screen 5: Review History & Search (`/history`)
- Search input by project name, snippet keyword, or file name.
- Filters: Date range, Minimum score, Language, Severity level.
- Multi-select actions & quick delete.
