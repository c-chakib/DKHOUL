import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/environment';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateAccessToken = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: config.jwt.expiresIn as any
  };
  return jwt.sign(payload, config.jwt.secret, options);
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: config.jwt.refreshExpiresIn as any
  };
  return jwt.sign(payload, config.jwt.refreshSecret, options);
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.secret) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;
};

export const generateToken = (payload: any, expiresIn: string | number = '30d'): string => {
  const options: SignOptions = {
    expiresIn: expiresIn as any
  };
  return jwt.sign(payload, config.jwt.secret, options);
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const decodeToken = (token: string): any => {
  return jwt.decode(token);
};

