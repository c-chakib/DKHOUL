import { Router } from 'express';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  deleteServicePhoto,
  searchByLocation,
  getProviderServices,
  toggleAvailability
} from '../controllers/service.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { createServiceValidation, updateServiceValidation, adminActionValidation } from '../utils/validationRules';
import { validate, sanitizeInput } from '../middleware/validation.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// Public routes
router.get('/', sanitizeInput, getServices);
router.get('/search/location', sanitizeInput, searchByLocation);
router.get('/provider/:providerId', sanitizeInput, getProviderServices);
router.get('/:id', sanitizeInput, getServiceById);

// Protected routes (Provider/Host only)
router.post(
  '/',
  authenticate,
  authorize('provider', 'host', 'admin'),
  sanitizeInput,
  upload.array('photos', 10),
  createServiceValidation,
  validate,
  createService
);

router.put(
  '/:id',
  authenticate,
  authorize('provider', 'host', 'admin'),
  sanitizeInput,
  upload.array('photos', 10),
  updateServiceValidation,
  validate,
  updateService
);

router.delete(
  '/:id',
  authenticate,
  sanitizeInput,
  adminActionValidation,
  validate,
  deleteService
);

router.delete(
  '/:id/photo',
  authenticate,
  authorize('provider', 'host', 'admin'),
  sanitizeInput,
  adminActionValidation,
  validate,
  deleteServicePhoto
);

router.patch(
  '/:id/availability',
  authenticate,
  authorize('provider', 'host', 'admin'),
  sanitizeInput,
  adminActionValidation,
  validate,
  toggleAvailability
);

export default router;

