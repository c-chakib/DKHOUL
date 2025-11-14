import { Request, Response, NextFunction } from 'express';
import User from '../models/User.model';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.util';
import { AppError } from '../middleware/error.middleware';
import crypto from 'crypto';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/email.service';
import { verifyGoogleToken } from '../services/auth.service';

// Register new user
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Email already registered', 400));
    }
    
    // Create email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    // Map role from frontend to backend
    const userRole = role === 'provider' ? 'host' : 'tourist';
    
    // Create user with proper profile structure
    const user = await User.create({
      email,
      password, // Will be hashed by pre-save hook
      role: userRole,
      profile: {
        firstName,
        lastName,
        phone: phoneNumber,
        languages: []
      },
      verificationToken,
      emailVerified: false,
      notificationPreferences: {
        email: true,
        push: true,
        sms: false
      }
    });
    
    // Send verification email
    await sendVerificationEmail(user.email, verificationToken);
    
    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });
    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });
    
    // Remove password from response
    const userResponse = user.toObject();
    const { password: _, ...userWithoutPassword } = userResponse;
    
    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email.',
      data: {
        user: userWithoutPassword,
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login user
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    
    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated'
      });
    }
    
    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });
    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });
    
    // Remove password from response
    const userResponse = user.toObject();
    const { password: _, ...userWithoutPassword } = userResponse;
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

// Verify email
export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;
    
    const user = await User.findOne({
      verificationToken: token
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }
    
    user.emailVerified = true;
    user.verificationToken = undefined;
    await user.save();
    
    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Request password reset
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists
      return res.json({
        success: true,
        message: 'If the email exists, a password reset link has been sent'
      });
    }
    
    // Create reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();
    
    // Send reset email
    await sendPasswordResetEmail(user.email, resetToken);
    
    res.json({
      success: true,
      message: 'If the email exists, a password reset link has been sent'
    });
  } catch (error) {
    next(error);
  }
};

// Reset password
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return next(new AppError('Invalid or expired reset token', 400));
    }
    
    user.password = password; // Will be hashed by pre-save hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Refresh access token
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken: token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token required'
      });
    }
    
    // Verify refresh token
    try {
      const decoded = verifyRefreshToken(token);
      
      // Get user
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Generate new access token
      const accessToken = generateAccessToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role
      });
      
      res.json({
        success: true,
        data: {
          accessToken
        }
      });
    } catch (tokenError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }
  } catch (error) {
    next(error);
  }
};

// Logout (client should delete tokens)
export const logout = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // User is attached by auth middleware
    const userId = (req as any).user.userId;
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    
    res.json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

// Google OAuth Login
export const googleAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return next(new AppError('Google ID token is required', 400));
    }

    // Verify Google token
    const googleUser = await verifyGoogleToken(idToken);

    if (!googleUser || !googleUser.email) {
      return next(new AppError('Invalid Google token', 401));
    }

    // Check if user exists
    let user = await User.findOne({ email: googleUser.email });

    if (user) {
      // User exists - update Google ID if not set
      if (!user.oauth?.googleId) {
        user.oauth = {
          googleId: googleUser.sub,
          facebookId: user.oauth?.facebookId
        };
        await user.save();
      }
    } else {
      // Create new user with Google OAuth
      const nameParts = googleUser.name?.split(' ') || ['User'];
      const firstName = nameParts[0] || 'User';
      const lastName = nameParts.slice(1).join(' ') || '';

      user = await User.create({
        email: googleUser.email,
        role: 'tourist',
        profile: {
          firstName,
          lastName,
          photo: googleUser.picture || 'https://via.placeholder.com/150',
          languages: []
        },
        oauth: {
          googleId: googleUser.sub
        },
        emailVerified: true, // Google emails are verified
        notificationPreferences: {
          email: true,
          push: true,
          sms: false
        }
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    // Remove sensitive data
    const userResponse: any = user.toObject();
    delete userResponse.password;
    delete userResponse.verificationToken;
    delete userResponse.resetPasswordToken;

    res.json({
      success: true,
      message: user.isNew ? 'Account created successfully' : 'Login successful',
      data: {
        user: userResponse,
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

