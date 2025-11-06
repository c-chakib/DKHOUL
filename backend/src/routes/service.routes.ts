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
import { serviceValidation } from '../utils/validators';
import { validate } from '../middleware/validation.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// Public routes
router.get('/', getServices);
router.get('/search/location', searchByLocation);
router.get('/provider/:providerId', getProviderServices);
router.get('/:id', getServiceById);

// Protected routes (Provider/Host only)
router.post(
  '/',
  authenticate,
  authorize('provider', 'host', 'admin'),
  upload.array('photos', 10),
  serviceValidation,
  validate,
  createService
);

router.put(
  '/:id',
  authenticate,
  authorize('provider', 'host', 'admin'),
  upload.array('photos', 10),
  updateService
);

router.delete(
  '/:id',
  authenticate,
  deleteService
);

router.delete(
  '/:id/photo',
  authenticate,
  authorize('provider', 'host', 'admin'),
  deleteServicePhoto
);

router.patch(
  '/:id/availability',
  authenticate,
  authorize('provider', 'host', 'admin'),
  toggleAvailability
);

export default router;

