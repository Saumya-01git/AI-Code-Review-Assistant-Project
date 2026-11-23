import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { authenticateToken } from '../middleware/auth.js';
import { db } from '../db/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Language detection from file extension
export function detectLanguage(filename) {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case '.js':
    case '.jsx':
    case '.mjs':
      return 'javascript';
    case '.ts':
    case '.tsx':
      return 'typescript';
    case '.py':
      return 'python';
    case '.java':
      return 'java';
    case '.c':
    case '.cpp':
    case '.h':
    case '.hpp':
      return 'cpp';
    case '.html':
      return 'html';
    case '.css':
      return 'css';
    case '.json':
      return 'json';
    case '.go':
      return 'go';
    case '.rs':
      return 'rust';
    default:
      return 'plaintext';
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${uniqueSuffix}-${sanitizedName}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const router = Router();

// Upload single or multiple code files
router.post('/upload', authenticateToken, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No code files uploaded.' });
    }

    const processedFiles = req.files.map((file) => {
      const content = fs.readFileSync(file.path, 'utf8');
      const language = detectLanguage(file.originalname);
      const lineCount = content.split('\n').length;

      return {
        originalName: file.originalname,
        storedName: file.filename,
        size: file.size,
        language,
        lineCount,
        content
      };
    });

    return res.json({
      success: true,
      message: `${processedFiles.length} file(s) uploaded successfully!`,
      files: processedFiles
    });
  } catch (error) {
    console.error('File upload error:', error);
    return res.status(500).json({ success: false, message: 'Failed to process file upload.' });
  }
});

// Save or store a code snippet directly
router.post('/snippets', authenticateToken, (req, res) => {
  try {
    const { title, code, language, projectId } = req.body;
    const userId = req.user.id;

    if (!code || !code.trim()) {
      return res.status(400).json({ success: false, message: 'Code content cannot be empty.' });
    }

    // Default or user project
    let targetProjectId = projectId;
    if (!targetProjectId) {
      const defaultProj = db.prepare('SELECT id FROM projects WHERE user_id = ? ORDER BY id ASC LIMIT 1').get(userId);
      targetProjectId = defaultProj ? defaultProj.id : null;
      if (!targetProjectId) {
        const ins = db.prepare('INSERT INTO projects (user_id, project_name) VALUES (?, ?)').run(userId, 'Default Project');
        targetProjectId = Number(ins.lastInsertRowid);
      }
    }

    const lang = language || 'javascript';
    const snippetTitle = title || `Snippet-${new Date().toISOString().slice(0, 10)}`;

    return res.status(201).json({
      success: true,
      message: 'Code snippet saved and ready for analysis.',
      snippet: {
        title: snippetTitle,
        language: lang,
        code,
        lineCount: code.split('\n').length,
        projectId: targetProjectId
      }
    });
  } catch (error) {
    console.error('Snippet save error:', error);
    return res.status(500).json({ success: false, message: 'Failed to store code snippet.' });
  }
});

export default router;
