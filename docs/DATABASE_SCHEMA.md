# Relational Database Schema Design (SQLite / PostgreSQL Compatible)

The database schema directly maps the data structures specified in the project specification.

## Tables & Relationships

```
+--------------------+        +---------------------+
|      USERS         |        |      PROJECTS       |
+--------------------+        +---------------------+
| id (PK)            | 1    * | id (PK)             |
| name               |------->| user_id (FK)        |
| email (UNIQUE)     |        | project_name        |
| password (HASHED)  |        | github_url          |
| reset_token        |        | created_at          |
| reset_token_expiry |        +----------+----------+
| created_at         |                   | 1
+--------------------+                   |
                                         | *
                              +----------v----------+
                              |       REVIEWS       |
                              +---------------------+
                              | id (PK)             |
                              | project_id (FK)     |
                              | review_type         |
                              | overall_score       |
                              | summary             |
                              | language            |
                              | raw_code            |
                              | metrics (JSON)      |
                              | documentation (JSON)|
                              | created_at          |
                              +----------+----------+
                                         | 1
                                         | *
                              +----------v----------+
                              |   REVIEW FINDINGS   |
                              +---------------------+
                              | id (PK)             |
                              | review_id (FK)      |
                              | severity            |
                              | issue               |
                              | explanation         |
                              | suggested_fix       |
                              | file_name           |
                              | line_number         |
                              +---------------------+
```

## SQL DDL Definitions

```sql
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  reset_token TEXT,
  reset_token_expiry INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  project_name TEXT NOT NULL,
  github_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  review_type TEXT NOT NULL, -- 'snippet' | 'file_upload'
  overall_score INTEGER NOT NULL DEFAULT 80,
  summary TEXT,
  language TEXT,
  raw_code TEXT,
  metrics TEXT, -- JSON cyclomatic, loc, functions, classes
  documentation TEXT, -- JSON function and class docstrings
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS review_findings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  review_id INTEGER NOT NULL,
  severity TEXT NOT NULL, -- 'error' | 'warning' | 'info'
  issue TEXT NOT NULL,
  explanation TEXT NOT NULL,
  suggested_fix TEXT,
  file_name TEXT,
  line_number INTEGER,
  FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE
);
```
