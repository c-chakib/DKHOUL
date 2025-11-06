import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  status: 'fail' | 'error';
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 500 ? 'error' : 'fail';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  // default to the error message so tests that expect custom messages pass
  let message = err.message || 'Internal Server Error';
  let statusStr: 'fail' | 'error' = 'error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    statusStr = err.status;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  } else if ((err as any).code === 11000) {
    // Tests expect duplicate key errors to be reported as 400
    statusCode = 400;
    const keys = Object.keys((err as any).keyValue || {}).join(', ');
    message = keys ? `${keys} already exists` : 'Duplicate field value entered';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  console.error('Error:', err);

  res.status(statusCode).json({
    success: false,
    status: statusStr || (statusCode >= 500 ? 'error' : 'fail'),
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

