/**
 * Input Validation & Sanitization Helper Middleware
 */

export function validateRegister(req, res, next) {
  const { name, email, password } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Valid full name is required.' });
  }

  if (!email || typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
    return res.status(400).json({ success: false, message: 'Valid email address is required.' });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
  }

  next();
}

export function validateCodeSubmission(req, res, next) {
  const { code } = req.body;

  if (!code || typeof code !== 'string' || !code.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Source code content cannot be empty.'
    });
  }

  // Max 2MB code payload safeguard
  if (code.length > 2 * 1024 * 1024) {
    return res.status(400).json({
      success: false,
      message: 'Code payload exceeds maximum in-memory threshold (2MB).'
    });
  }

  next();
}
