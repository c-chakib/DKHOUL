import { Request, Response, NextFunction } from 'express';
import { errorHandler, AppError, notFound } from '../../middleware/error.middleware';

describe('Error Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      path: '/api/test',
      method: 'GET'
    };
    
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn();
    
    mockResponse = {
      status: statusMock,
      json: jsonMock
    };
    
    mockNext = jest.fn();
  });

  describe('AppError Class', () => {
    it('should create operational error with correct properties', () => {
      const error = new AppError('Test error message', 400);
      
      expect(error.message).toBe('Test error message');
      expect(error.statusCode).toBe(400);
      expect(error.status).toBe('fail');
      expect(error.isOperational).toBe(true);
    });

    it('should set status to "error" for 5xx codes', () => {
      const error = new AppError('Server error', 500);
      
      expect(error.status).toBe('error');
    });

    it('should set status to "fail" for 4xx codes', () => {
      const error = new AppError('Client error', 404);
      
      expect(error.status).toBe('fail');
    });

    it('should inherit from Error', () => {
      const error = new AppError('Test', 400);
      
      expect(error instanceof Error).toBe(true);
    });
  });

  describe('errorHandler', () => {
    it('should handle AppError correctly', () => {
      const error = new AppError('Resource not found', 404);
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        status: 'fail',
        message: 'Resource not found'
      });
    });

    it('should handle validation errors', () => {
      const error: any = new Error('Validation failed');
      error.name = 'ValidationError';
      error.statusCode = 400;
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalled();
    });

    it('should handle MongoDB CastError', () => {
      const error: any = new Error('Cast to ObjectId failed');
      error.name = 'CastError';
      error.path = '_id';
      error.value = 'invalid-id';
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining('Invalid')
        })
      );
    });

    it('should handle MongoDB duplicate key error', () => {
      const error: any = new Error('Duplicate key');
      error.code = 11000;
      error.keyValue = { email: 'test@test.com' };
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining('already exists')
        })
      );
    });

    it('should handle JWT errors', () => {
      const error: any = new Error('jwt malformed');
      error.name = 'JsonWebTokenError';
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining('Invalid token')
        })
      );
    });

    it('should handle JWT expired error', () => {
      const error: any = new Error('jwt expired');
      error.name = 'TokenExpiredError';
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining('expired')
        })
      );
    });

    it('should handle generic errors with 500 status', () => {
      const error = new Error('Something went wrong');
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          status: 'error',
          message: 'Something went wrong'
        })
      );
    });

    it('should include stack trace in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      const error = new Error('Test error');
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          stack: expect.any(String)
        })
      );
      
      process.env.NODE_ENV = originalEnv;
    });

    it('should not include stack trace in production mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      const error = new Error('Test error');
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
      
      const callArgs = jsonMock.mock.calls[0][0];
      expect(callArgs.stack).toBeUndefined();
      
      process.env.NODE_ENV = originalEnv;
    });

    it('should log error to console', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const error = new Error('Test error');
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('notFound', () => {
    it('should create 404 error for unknown routes', () => {
      mockRequest.originalUrl = '/api/unknown';
      
      notFound(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 404,
          message: expect.stringContaining('/api/unknown')
        })
      );
    });

    it('should create AppError instance', () => {
      mockRequest.originalUrl = '/test';
      
      notFound(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(
        expect.any(AppError)
      );
    });

    it('should include original URL in message', () => {
      const testUrl = '/api/nonexistent/route';
      mockRequest.originalUrl = testUrl;
      
      notFound(mockRequest as Request, mockResponse as Response, mockNext);
      
      const error = (mockNext as jest.Mock).mock.calls[0][0];
      expect(error.message).toContain(testUrl);
    });
  });

  describe('Error Response Format', () => {
    it('should always include success: false', () => {
      const error = new AppError('Test', 400);
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false
        })
      );
    });

    it('should include status field', () => {
      const error = new AppError('Test', 400);
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          status: expect.any(String)
        })
      );
    });

    it('should include message field', () => {
      const error = new AppError('Custom message', 400);
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Custom message'
        })
      );
    });
  });
});
