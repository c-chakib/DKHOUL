import { body, param, query, ValidationChain } from 'express-validator';

export const emailValidator = body('email').isEmail().withMessage('Valid email is required');

export const passwordValidator = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters');

export const idValidator = param('id').isMongoId().withMessage('Invalid ID format');

export const paginationValidators = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];

export const registerValidation: ValidationChain[] = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('phoneNumber').optional().trim(),
  body('role').optional().isIn(['tourist', 'host', 'user', 'provider']).withMessage('Invalid role')
];

export const loginValidation: ValidationChain[] = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

export const serviceValidation: ValidationChain[] = [
  body('category').isIn(['Space', 'Skills', 'Connect']).withMessage('Invalid category'),
  body('title').trim().isLength({ min: 10, max: 100 }).withMessage('Title must be 10-100 characters'),
  body('description').trim().isLength({ min: 50, max: 2000 }).withMessage('Description must be 50-2000 characters'),
  body('pricing.amount').isNumeric().withMessage('Price must be a number'),
  body('location.city').trim().notEmpty().withMessage('City is required'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1')
];

export const bookingValidation: ValidationChain[] = [
  body('serviceId').isMongoId().withMessage('Valid service ID is required'),
  body('bookingDate').isISO8601().withMessage('Valid date is required'),
  body('numberOfGuests').isInt({ min: 1 }).withMessage('At least 1 guest required'),
  body('timeSlot.startTime').notEmpty().withMessage('Start time is required'),
  body('timeSlot.endTime').notEmpty().withMessage('End time is required')
];

export const reviewValidation: ValidationChain[] = [
  body('bookingId').isMongoId().withMessage('Valid booking ID is required'),
  // Support both new ratings object and legacy single rating field
  body('ratings.overall').optional().isInt({ min: 1, max: 5 }).withMessage('Overall rating must be 1-5'),
  body('ratings.communication').optional().isInt({ min: 1, max: 5 }).withMessage('Communication rating must be 1-5'),
  body('ratings.accuracy').optional().isInt({ min: 1, max: 5 }).withMessage('Accuracy rating must be 1-5'),
  body('ratings.value').optional().isInt({ min: 1, max: 5 }).withMessage('Value rating must be 1-5'),
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  body('comment').trim().isLength({ min: 10, max: 1000 }).withMessage('Comment must be 10-1000 characters')
];

