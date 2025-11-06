import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config/environment';
import crypto from 'crypto';
import axios from 'axios';

// Generate JWT token
export const generateToken = (userId: string, email: string, role: string): string => {
  return (jwt.sign as any)(
    { userId, email, role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

// Generate refresh token
export const generateRefreshToken = (userId: string): string => {
  return (jwt.sign as any)(
    { userId },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );
};

// Verify JWT token
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Verify refresh token
export const verifyRefreshToken = (token: string): any => {
  try {
    return jwt.verify(token, config.jwt.refreshSecret);
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12);
};

// Compare password
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

// Generate random token
export const generateRandomToken = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};

// Hash token (for storing in DB)
export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

// Verify Google OAuth token
export const verifyGoogleToken = async (token: string): Promise<any> => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`
    );
    return response.data;
  } catch (error) {
    throw new Error('Invalid Google token');
  }
};

// Verify Facebook OAuth token
export const verifyFacebookToken = async (token: string): Promise<any> => {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${token}`
    );
    return response.data;
  } catch (error) {
    throw new Error('Invalid Facebook token');
  }
};

// Generate email verification token
export const generateVerificationToken = (): {
  token: string;
  hashedToken: string;
  expiresAt: Date;
} => {
  const token = generateRandomToken();
  const hashedToken = hashToken(token);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  return { token, hashedToken, expiresAt };
};

// Generate password reset token
export const generatePasswordResetToken = (): {
  token: string;
  hashedToken: string;
  expiresAt: Date;
} => {
  const token = generateRandomToken();
  const hashedToken = hashToken(token);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  return { token, hashedToken, expiresAt };
};

// Validate password strength
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Extract token from Authorization header
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};

// Check if user is authenticated
export const isAuthenticated = (token: string | null): boolean => {
  if (!token) return false;
  
  try {
    verifyToken(token);
    return true;
  } catch {
    return false;
  }
};

