import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import githubRoutes from './routes/githubRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import './db/database.js'; // Ensures tables are initialized

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'AI Code Review Assistant API',
    timestamp: new Date().toISOString()
  });
});

// Authentication Routes
app.use('/api/auth', authRoutes);

// File Upload & Snippet Routes
app.use('/api', uploadRoutes);

// GitHub Integration Scope Routes
app.use('/api', githubRoutes);

// Review Engine Routes
app.use('/api', reviewRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found` });
});

// Centralized Error Handler Middleware
app.use(errorHandler);

// Only start server if executed directly
const isDirectExecution = process.argv[1] && fileURLToPath(import.meta.url).toLowerCase() === path.resolve(process.argv[1]).toLowerCase();

if (isDirectExecution || process.env.NODE_ENV === 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Code Review Backend running at http://localhost:${PORT}`);
  });
}

export default app;
