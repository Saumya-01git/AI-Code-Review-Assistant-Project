import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { db } from '../db/database.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/jwt.js';

// User Registration
export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = db.prepare(`
      INSERT INTO users (name, email, password)
      VALUES (?, ?, ?)
    `).run(name.trim(), normalizedEmail, hashedPassword);

    const userId = Number(result.lastInsertRowid);
    const token = jwt.sign({ id: userId, email: normalizedEmail }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Also auto-create a default project for the user
    db.prepare(`
      INSERT INTO projects (user_id, project_name, github_url)
      VALUES (?, ?, ?)
    `).run(userId, 'Default Workspace', '');

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: userId,
        name: name.trim(),
        email: normalizedEmail
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
}

// User Login
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
}

// Get Current User Profile
export function getMe(req, res) {
  return res.json({
    success: true,
    user: req.user
  });
}

// Update User Profile
export async function updateProfile(req, res) {
  try {
    const { name, currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (name) {
      db.prepare('UPDATE users SET name = ? WHERE id = ?').run(name.trim(), userId);
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: 'Current password is required to change password.' });
      }
      const user = db.prepare('SELECT password FROM users WHERE id = ?').get(userId);
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password does not match.' });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashedPassword, userId);
    }

    const updated = db.prepare('SELECT id, name, email, created_at FROM users WHERE id = ?').get(userId);
    return res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: updated
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating profile.' });
  }
}

// Forgot Password (generates a secure reset token)
export function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);

    if (!user) {
      // Return success even if email not found to avoid user enumeration
      return res.json({
        success: true,
        message: 'If the email exists, a password reset token has been issued.'
      });
    }

    const resetToken = crypto.randomBytes(24).toString('hex');
    const expiry = Date.now() + 3600000; // 1 hour

    db.prepare('UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?')
      .run(resetToken, expiry, user.id);

    return res.json({
      success: true,
      message: 'Password reset token generated successfully.',
      resetToken, // Returned for UI testing / development convenience
      note: 'In production, this token is sent via email.'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ success: false, message: 'Server error requesting password reset.' });
  }
}

// Reset Password
export async function resetPassword(req, res) {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({ success: false, message: 'Reset token and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const user = db.prepare('SELECT id, reset_token_expiry FROM users WHERE reset_token = ?').get(resetToken);

    if (!user || user.reset_token_expiry < Date.now()) {
      return res.status(400).json({ success: false, message: 'Reset token is invalid or expired.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    db.prepare('UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?')
      .run(hashedPassword, user.id);

    return res.json({
      success: true,
      message: 'Password has been reset successfully. You can now login.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ success: false, message: 'Server error resetting password.' });
  }
}
