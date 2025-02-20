import { Router } from 'express';
import { customPackageController } from './coustomPackage.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

const router = Router();

router.post(
  '/create-coustomPackage',
  auth(USER_ROLE.administrator),
  customPackageController.createCustomPackage,
);

router.patch(
  '/update/:id',
  auth(USER_ROLE.admin),
  customPackageController.updateCustomPackage,
);

router.delete('/:id', customPackageController.deleteCustomPackage);

router.get('/:id', customPackageController.getCustomPackageById);
router.get('/', customPackageController.getAllCustomPackages);

export const coustomPackageRoutes = router;
