# 🌐 REST API Documentation - AI Code Review Assistant

Welcome to the comprehensive API documentation for the **AI Code Review Assistant**. The backend runs on Node.js (v24 native runtime) with SQLite (`node:sqlite`), JWT authentication, and dual-stage code analysis engines.

---

## Base URL
- **Local Development**: `http://localhost:5000`
- **Prefix**: `/api`

---

## 1. Authentication Endpoints (`/api/auth`)

### 1.1 Register User
- **Method**: `POST`
- **Path**: `/api/auth/register`
- **Request Body**:
  ```json
  {
    "name": "Jane Developer",
    "email": "jane@example.com",
    "password": "securePassword123"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOi...",
    "user": { "id": 1, "name": "Jane Developer", "email": "jane@example.com" }
  }
  ```

### 1.2 User Login
- **Method**: `POST`
- **Path**: `/api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "securePassword123"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOi...",
    "user": { "id": 1, "name": "Jane Developer", "email": "jane@example.com" }
  }
  ```

### 1.3 Get Current Profile
- **Method**: `GET`
- **Path**: `/api/auth/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "user": { "id": 1, "name": "Jane Developer", "email": "jane@example.com", "role": "developer" }
  }
  ```

### 1.4 Password Recovery Request
- **Method**: `POST`
- **Path**: `/api/auth/forgot-password`
- **Request Body**:
  ```json
  { "email": "jane@example.com" }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Reset token generated",
    "resetToken": "0a1b2c3d4e..."
  }
  ```

### 1.5 Password Reset
- **Method**: `POST`
- **Path**: `/api/auth/reset-password`
- **Request Body**:
  ```json
  {
    "resetToken": "0a1b2c3d4e...",
    "newPassword": "newSecretPassword123"
  }
  ```

---

## 2. Review Engine Endpoints (`/api/reviews`)

### 2.1 Stage 1: Static AST Code Analysis
- **Method**: `POST`
- **Path**: `/api/reviews/static`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "code": "var x = 10; if (x == 10) eval('console.log(x)');",
    "language": "javascript",
    "title": "Auth Handler Review"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "reviewId": 12,
    "qualityScore": 62,
    "findings": [
      {
        "line": 1,
        "rule": "no-var",
        "severity": "medium",
        "message": "Unexpected 'var', use 'let' or 'const' instead."
      },
      {
        "line": 1,
        "rule": "no-eval",
        "severity": "critical",
        "message": "Usage of eval() poses severe security risks."
      }
    ]
  }
  ```

### 2.2 Stage 2: AI Code Review & Refactoring
- **Method**: `POST`
- **Path**: `/api/reviews/ai`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "code": "function calc(a, b) { return a + b; }",
    "language": "javascript",
    "promptType": "all"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "reviewId": 13,
    "aiAnalysis": {
      "explanation": "Calculates the numeric sum of parameters a and b.",
      "potentialBugs": ["No type validation for non-numeric operands."],
      "namingSuggestions": ["Rename 'calc' to 'addNumbers' for descriptive intent."],
      "refactoredCode": "/**\n * Adds two numbers safely\n */\nfunction addNumbers(a, b) {\n  if (typeof a !== 'number' || typeof b !== 'number') throw new TypeError('Operands must be numbers');\n  return a + b;\n}"
    }
  }
  ```

### 2.3 Stage 1 + 2 Combined Review
- **Method**: `POST`
- **Path**: `/api/reviews/full`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "code": "function test() { var secret = 'API_KEY_123456'; }",
    "language": "javascript"
  }
  ```
- **Response `200 OK`**:
  Composite payload with AST static findings, AI reasoning, complexity analysis, and weighted quality score.

### 2.4 Cyclomatic Complexity & Code Smells
- **Method**: `POST`
- **Path**: `/api/reviews/complexity`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "code": "function nested(a, b) { if (a) { while (b) { if (a > b) return a; } } return b; }",
    "language": "javascript"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "cyclomaticComplexity": 4,
    "complexityGrade": "Low Complexity (A)",
    "loc": 1,
    "functionsCount": 1,
    "smells": []
  }
  ```

### 2.5 Auto Documentation Generator
- **Method**: `POST`
- **Path**: `/api/reviews/docs`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "code": "class PaymentService { processPayment(orderId, amount) { return true; } }",
    "language": "javascript"
  }
  ```
- **Response `200 OK`**:
  Returns JSDoc/Docstrings for functions, classes, and OpenAPI-style endpoint descriptions.

---

## 3. History & Audit Endpoints

### 3.1 List User Reviews
- **Method**: `GET`
- **Path**: `/api/reviews?language=javascript&search=auth`
- **Headers**: `Authorization: Bearer <token>`

### 3.2 Get Review By ID
- **Method**: `GET`
- **Path**: `/api/reviews/:id`
- **Headers**: `Authorization: Bearer <token>`

### 3.3 Delete Review
- **Method**: `DELETE`
- **Path**: `/api/reviews/:id`
- **Headers**: `Authorization: Bearer <token>`

---

## 4. File Upload & Snippets

### 4.1 Multi-File Upload
- **Method**: `POST`
- **Path**: `/api/upload`
- **Headers**: `Content-Type: multipart/form-data`, `Authorization: Bearer <token>`
- **Form Fields**: `files` (array of `.js`, `.ts`, `.py`, `.json`, `.jsx`, `.tsx`, `.txt`)

### 4.2 Save Snippet
- **Method**: `POST`
- **Path**: `/api/snippets`
- **Headers**: `Authorization: Bearer <token>`
