import multer from 'multer';

/**
 * Centralized Application Error Handler Middleware
 * Normalizes error outputs, logs server traces, and handles
 * Multer limit errors, syntax errors, and database errors.
 */
export function errorHandler(err, req, res, next) {
  // Multer Specific Errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'LIMIT_FILE_SIZE',
        message: 'File size exceeds maximum limit of 5MB.'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'LIMIT_FILE_COUNT',
        message: 'Too many files uploaded. Maximum is 10 files per request.'
      });
    }
    return res.status(400).json({
      success: false,
      error: err.code,
      message: err.message
    });
  }

  // Bad JSON request body
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'INVALID_JSON_BODY',
      message: 'Malformed JSON payload in request body.'
    });
  }

  // Custom Application or Validation Error
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.name || 'APPLICATION_ERROR',
      message: err.message
    });
  }

  console.error('💥 Unhandled Server Exception:', err);
  return res.status(500).json({
    success: false,
    error: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected internal server error occurred.'
  });
}
