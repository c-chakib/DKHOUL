import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from '../../utils/jwt.util';

describe('JWT Utilities', () => {
  const testPayload = {
    userId: '123456789',
    email: 'test@test.com',
    role: 'tourist'
  };

  describe('generateAccessToken', () => {
    it('should generate a valid access token', () => {
      const token = generateAccessToken(testPayload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should generate different tokens for different payloads', () => {
      const token1 = generateAccessToken(testPayload);
      const token2 = generateAccessToken({ ...testPayload, userId: '987654321' });
      
      expect(token1).not.toBe(token2);
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid refresh token', () => {
      const token = generateRefreshToken(testPayload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify a valid access token', () => {
      const token = generateAccessToken(testPayload);
      const decoded = verifyAccessToken(token);
      
      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe(testPayload.userId);
      expect(decoded.email).toBe(testPayload.email);
      expect(decoded.role).toBe(testPayload.role);
    });

    it('should throw error for invalid token', () => {
      expect(() => {
        verifyAccessToken('invalid-token');
      }).toThrow();
    });

    it('should throw error for malformed token', () => {
      expect(() => {
        verifyAccessToken('not.a.token');
      }).toThrow();
    });

    it('should throw error for tampered token', () => {
      const token = generateAccessToken(testPayload);
      const tamperedToken = token.slice(0, -10) + 'tampered123';
      
      expect(() => {
        verifyAccessToken(tamperedToken);
      }).toThrow();
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify a valid refresh token', () => {
      const token = generateRefreshToken(testPayload);
      const decoded = verifyRefreshToken(token);
      
      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe(testPayload.userId);
      expect(decoded.email).toBe(testPayload.email);
      expect(decoded.role).toBe(testPayload.role);
    });

    it('should throw error for invalid refresh token', () => {
      expect(() => {
        verifyRefreshToken('invalid-refresh-token');
      }).toThrow();
    });
  });

  describe('Token expiration', () => {
    it('should include expiration claim', () => {
      const token = generateAccessToken(testPayload);
      const decoded: any = verifyAccessToken(token);
      
      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeGreaterThan(decoded.iat);
    });
  });
});
