import { body, param, query, ValidationChain } from 'express-validator';

// Common validation rules
export const emailValidation = body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Please provide a valid email address');

export const passwordValidation = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number');

export const nameValidation = body('name')
  .trim()
  .isLength({ min: 2, max: 50 })
  .withMessage('Name must be between 2 and 50 characters')
  .matches(/^[a-zA-Z\s]+$/)
  .withMessage('Name can only contain letters and spaces');

export const phoneValidation = body('phone')
  .optional()
  .isMobilePhone('any')
  .withMessage('Please provide a valid phone number');

export const mongoIdValidation = (field: string): ValidationChain => {
  return param(field)
    .isMongoId()
    .withMessage(`${field} must be a valid ID`);
};

// Auth validation rules
export const registerValidation: ValidationChain[] = [
  emailValidation,
  passwordValidation,
  nameValidation,
  phoneValidation,
  body('role')
    .optional()
    .isIn(['user', 'host', 'admin'])
    .withMessage('Role must be user, host, or admin')
];

export const loginValidation: ValidationChain[] = [
  emailValidation,
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

export const refreshTokenValidation: ValidationChain[] = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required')
];

export const verifyEmailValidation: ValidationChain[] = [
  param('token')
    .notEmpty()
    .withMessage('Verification token is required')
];

export const forgotPasswordValidation: ValidationChain[] = [
  emailValidation
];

export const resetPasswordValidation: ValidationChain[] = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  passwordValidation,
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    })
];

// User validation rules
export const updateProfileValidation: ValidationChain[] = [
  nameValidation,
  phoneValidation,
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio must be less than 500 characters'),
  body('location')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Location must be between 2 and 100 characters'),
  body('languages')
    .optional()
    .isArray()
    .withMessage('Languages must be an array'),
  body('languages.*')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Each language must be between 2 and 50 characters')
];

export const changePasswordValidation: ValidationChain[] = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  passwordValidation,
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    })
];

// Service validation rules
export const createServiceValidation: ValidationChain[] = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),
  body('category')
    .isIn(['accommodation', 'transport', 'food', 'activities', 'guide', 'other'])
    .withMessage('Invalid category'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('currency')
    .optional()
    .isIn(['MAD', 'USD', 'EUR'])
    .withMessage('Currency must be MAD, USD, or EUR'),
  body('location')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Location must be between 2 and 100 characters'),
  body('capacity')
    .isInt({ min: 1, max: 1000 })
    .withMessage('Capacity must be between 1 and 1000'),
  body('duration')
    .optional()
    .isInt({ min: 1, max: 168 }) // max 1 week in hours
    .withMessage('Duration must be between 1 and 168 hours'),
  body('availability')
    .optional()
    .isArray()
    .withMessage('Availability must be an array'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),
  body('images.*')
    .optional()
    .isURL()
    .withMessage('Each image must be a valid URL'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .isLength({ min: 2, max: 30 })
    .withMessage('Each tag must be between 2 and 30 characters')
];

export const updateServiceValidation: ValidationChain[] = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),
  body('category')
    .optional()
    .isIn(['accommodation', 'transport', 'food', 'activities', 'guide', 'other'])
    .withMessage('Invalid category'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('currency')
    .optional()
    .isIn(['MAD', 'USD', 'EUR'])
    .withMessage('Currency must be MAD, USD, or EUR'),
  body('location')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Location must be between 2 and 100 characters'),
  body('capacity')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Capacity must be between 1 and 1000'),
  body('duration')
    .optional()
    .isInt({ min: 1, max: 168 })
    .withMessage('Duration must be between 1 and 168 hours'),
  body('availability')
    .optional()
    .isArray()
    .withMessage('Availability must be an array'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),
  body('images.*')
    .optional()
    .isURL()
    .withMessage('Each image must be a valid URL'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .isLength({ min: 2, max: 30 })
    .withMessage('Each tag must be between 2 and 30 characters')
];

// Booking validation rules
export const createBookingValidation: ValidationChain[] = [
  body('serviceId')
    .isMongoId()
    .withMessage('Valid service ID is required'),
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid ISO date'),
  body('endDate')
    .isISO8601()
    .withMessage('End date must be a valid ISO date')
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  body('guests')
    .isInt({ min: 1, max: 50 })
    .withMessage('Number of guests must be between 1 and 50'),
  body('specialRequests')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Special requests must be less than 1000 characters'),
  body('contactInfo')
    .isObject()
    .withMessage('Contact info is required'),
  body('contactInfo.name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Contact name must be between 2 and 50 characters'),
  body('contactInfo.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid contact email is required'),
  body('contactInfo.phone')
    .isMobilePhone('any')
    .withMessage('Valid contact phone is required')
];

export const updateBookingStatusValidation: ValidationChain[] = [
  body('status')
    .isIn(['pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'rejected'])
    .withMessage('Status must be one of: pending, confirmed, in-progress, completed, cancelled, rejected'),
  body('reason')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Reason must be between 10 and 500 characters when provided')
];

export const cancelBookingValidation: ValidationChain[] = [
  body('reason')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Cancellation reason must be between 10 and 500 characters when provided')
];

// Review validation rules
export const createReviewValidation: ValidationChain[] = [
  body('serviceId')
    .isMongoId()
    .withMessage('Valid service ID is required'),
  body('bookingId')
    .isMongoId()
    .withMessage('Valid booking ID is required'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Comment must be between 10 and 1000 characters'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),
  body('images.*')
    .optional()
    .isURL()
    .withMessage('Each image must be a valid URL')
];

// Message validation rules
export const sendMessageValidation: ValidationChain[] = [
  body('receiverId')
    .isMongoId()
    .withMessage('Valid receiver ID is required'),
  body('content')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Message content must be between 1 and 2000 characters'),
  body('messageType')
    .optional()
    .isIn(['text', 'image', 'file'])
    .withMessage('Message type must be text, image, or file'),
  body('attachments')
    .optional()
    .isArray()
    .withMessage('Attachments must be an array'),
  body('attachments.*')
    .optional()
    .isObject()
    .withMessage('Each attachment must be an object'),
  body('attachments.*.type')
    .optional()
    .isIn(['image', 'document', 'video'])
    .withMessage('Attachment type must be image, document, or video'),
  body('attachments.*.url')
    .optional()
    .isURL()
    .withMessage('Attachment URL must be valid')
];

// Payment validation rules
export const createPaymentIntentValidation: ValidationChain[] = [
  body('bookingId')
    .isMongoId()
    .withMessage('Valid booking ID is required'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('currency')
    .isIn(['mad', 'usd', 'eur'])
    .withMessage('Currency must be MAD, USD, or EUR'),
  body('paymentMethodId')
    .optional()
    .isString()
    .withMessage('Payment method ID must be a string')
];

// Admin validation rules
export const adminActionValidation: ValidationChain[] = [
  param('id')
    .isMongoId()
    .withMessage('Valid ID is required')
];

export const adminStatsValidation: ValidationChain[] = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO date')
    .custom((endDate, { req }) => {
      const startDate = req.query?.startDate;
      if (startDate && new Date(endDate) <= new Date(startDate as string)) {
        throw new Error('End date must be after start date');
      }
      return true;
    })
];

// Search and filter validation
export const searchValidation: ValidationChain[] = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Search query must be between 2 and 100 characters'),
  query('category')
    .optional()
    .isIn(['accommodation', 'transport', 'food', 'activities', 'guide', 'other'])
    .withMessage('Invalid category'),
  query('location')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Location must be between 2 and 100 characters'),
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number')
    .custom((maxPrice, { req }) => {
      if (req.query && req.query.minPrice && parseFloat(maxPrice) <= parseFloat(req.query.minPrice as string)) {
        throw new Error('Maximum price must be greater than minimum price');
      }
      return true;
    }),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO date')
    .custom((endDate, { req }) => {
      if (req.query && req.query.startDate && new Date(endDate) <= new Date(req.query.startDate as string)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  query('guests')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Number of guests must be between 1 and 50'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

// Pagination validation
export const paginationValidation: ValidationChain[] = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt()
];