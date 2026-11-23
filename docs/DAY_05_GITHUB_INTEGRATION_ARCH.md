# Day 5: GitHub Repository API Architecture & Integration Specification

> **Curriculum Scope Status**: As documented on pages 1, 3, 7, and 9 of the project specification, GitHub Repository fetching is officially designated as **"Not Working on"** for the core submission flow in favor of high-performance in-memory Code Snippets and Multer Direct File Uploads.

---

## 1. Architectural Design for GitHub Repository Ingestion

Had full GitHub Repository ingestion been active in production, the following pipeline would be executed:

```
+-------------------+       +-----------------------+       +------------------------+
| User Enters Repo  | ----> | Express Server parses | ----> | GitHub REST API        |
| GitHub URL        |       | owner & repository    |       | /repos/{owner}/{repo}  |
+-------------------+       +-----------------------+       +-----------+------------+
                                                                        |
                                                                        v
+-------------------+       +-----------------------+       +------------------------+
| Two-Stage Review  | <---- | Base64 Decoded Text   | <---- | Recursive Git Tree     |
| (Static + AI)     |       | Files in Memory       |       | /git/trees/{sha}?rec=1 |
+-------------------+       +-----------------------+       +------------------------+
```

### Key Considerations:
1. **Rate Limiting**:
   - Unauthenticated GitHub API calls are capped at **60 requests/hour** per IP.
   - Production requires GitHub App OAuth tokens or fine-grained Personal Access Tokens (PATs) allowing 5,000 requests/hour.
2. **Repository Traversal**:
   - `GET https://api.github.com/repos/{owner}/{repo}/git/trees/main?recursive=1`
   - Filtering non-code files (`.png`, `.jpg`, `.lock`, `.exe`, `.zip`) and keeping code assets (`.js`, `.ts`, `.py`, etc.).
3. **Blob Content Fetching**:
   - `GET https://api.github.com/repos/{owner}/{repo}/git/blobs/{file_sha}`
   - Base64 payload decoding into UTF-8 source code strings.

---

## 2. Decision Rationale
Direct Code Snippet pasting via Monaco Editor and Multer multi-file upload allow developers to:
- Test private files without exposing sensitive credentials or granting repository-wide GitHub permissions.
- Test single functions and pull request diffs quickly without network roundtrips to GitHub.
- Avoid GitHub API rate-limit errors in offline or classroom settings.
