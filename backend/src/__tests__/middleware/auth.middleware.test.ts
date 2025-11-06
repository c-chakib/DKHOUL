import { Request, Response, NextFunction } from 'express';
import { authenticate, authorize, AuthRequest } from '../../middleware/auth.middleware';
import { generateTestToken, createTestUser } from '../utils/testHelpers';

describe('Auth Middleware', () => {
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    nextFunction = jest.fn();
  });

  describe('authenticate', () => {
    it('should allow access with valid token', async () => {
      const user = await createTestUser();
      const token = generateTestToken(user._id.toString(), user.email, user.role);
      
      mockRequest.headers = {
        authorization: `Bearer ${token}`
      };

      authenticate(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      expect(mockRequest.user).toBeDefined();
      expect(mockRequest.user?.userId).toBe(user._id.toString());
    });

    it('should reject expired token', () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTYiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJyb2xlIjoidG91cmlzdCIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNTE2MjM5MDIyfQ.invalid';
      
      mockRequest.headers = {
        authorization: `Bearer ${expiredToken}`
      };

      authenticate(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should reject invalid token format', () => {
      mockRequest.headers = {
        authorization: 'Bearer invalid-token-format'
      };

      authenticate(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should reject missing Authorization header', () => {
      mockRequest.headers = {};

      authenticate(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'No token provided'
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should reject malformed Authorization header', () => {
      mockRequest.headers = {
        authorization: 'InvalidFormat token123'
      };

      authenticate(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });

  describe('authorize', () => {
    it('should allow admin access to admin routes', async () => {
      const admin = await createTestUser('admin');
      const token = generateTestToken(admin._id.toString(), admin.email, admin.role);
      
      mockRequest.headers = {
        authorization: `Bearer ${token}`
      };
      mockRequest.user = {
        userId: admin._id.toString(),
        email: admin.email,
        role: admin.role
      };

      const authorizeMiddleware = authorize('admin');
      authorizeMiddleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });

    it('should allow host access to host routes', async () => {
      const host = await createTestUser('host');
      mockRequest.user = {
        userId: host._id.toString(),
        email: host.email,
        role: host.role
      };

      const authorizeMiddleware = authorize('host');
      authorizeMiddleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });

    it('should reject tourist access to host routes', async () => {
      const tourist = await createTestUser('tourist');
      mockRequest.user = {
        userId: tourist._id.toString(),
        email: tourist.email,
        role: tourist.role
      };

      const authorizeMiddleware = authorize('host', 'admin');
      authorizeMiddleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Forbidden: Insufficient permissions'
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should allow multiple allowed roles', async () => {
      const host = await createTestUser('host');
      mockRequest.user = {
        userId: host._id.toString(),
        email: host.email,
        role: host.role
      };

      const authorizeMiddleware = authorize('host', 'admin');
      authorizeMiddleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });

    it('should reject if user is not authenticated', () => {
      mockRequest.user = undefined;

      const authorizeMiddleware = authorize('admin');
      authorizeMiddleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });
});
