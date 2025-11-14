import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError } from 'express-validator';
import sanitizeHtml from 'sanitize-html';

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error: ValidationError) => ({
      field: (error as any).path || (error as any).param,
      message: error.msg
    }));

    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors
    });
    return;
  }

  next();
};

// Sanitization middleware
export const sanitizeInput = (_req: Request, res: Response, next: NextFunction): void => {
  // Sanitize string fields in body
  if (req.body) {
    sanitizeObject(req.body);
  }

  // Sanitize string fields in query
  if (req.query) {
    sanitizeObject(req.query);
  }

  // Sanitize string fields in params
  if (req.params) {
    sanitizeObject(req.params);
  }

  next();
};

const sanitizeObject = (obj: any): void => {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      // Remove HTML tags and potentially dangerous characters
      obj[key] = sanitizeHtml(obj[key], {
        allowedTags: [], // No HTML tags allowed
        allowedAttributes: {},
        disallowedTagsMode: 'discard'
      });

      // Trim whitespace
      obj[key] = obj[key].trim();

      // Remove null bytes and other control characters
      obj[key] = obj[key].replace(/[\x00-\x1F\x7F]/g, '');
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeObject(obj[key]);
    }
  }
};

// Combined validation and sanitization middleware
export const validateAndSanitize = [
  sanitizeInput,
  validate
];

