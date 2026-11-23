import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// URL parser helper
function parseGithubUrl(url) {
  if (!url) return null;
  const match = url.trim().match(/github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)/);
  if (!match) return null;
  return {
    owner: match[1],
    repo: match[2].replace(/\.git$/, '')
  };
}

// Educational inspection endpoint illustrating GitHub integration design
router.post('/github/inspect', authenticateToken, (req, res) => {
  const { githubUrl } = req.body;

  if (!githubUrl) {
    return res.status(400).json({
      success: false,
      message: 'GitHub repository URL is required.'
    });
  }

  const parsed = parseGithubUrl(githubUrl);
  if (!parsed) {
    return res.status(400).json({
      success: false,
      message: 'Invalid GitHub repository URL format. Example: https://github.com/owner/repository'
    });
  }

  return res.json({
    success: true,
    message: 'GitHub repository verified. In accordance with project curriculum specifications, GitHub repository direct ingestion is marked as out of scope in favor of Code Snippets and File Uploads.',
    repository: {
      owner: parsed.owner,
      repo: parsed.repo,
      fullUrl: `https://github.com/${parsed.owner}/${parsed.repo}`,
      status: 'Curriculum Out-of-Scope (Reference Architecture Implemented)',
      recommendedAlternative: 'Please paste code directly or upload source files via the Review Studio.'
    }
  });
});

export default router;
