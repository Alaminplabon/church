import { Router } from 'express';
import { codeController } from './codeGenerator.controller';
import { USER_ROLE } from '../user/user.constants';
import auth from '../../middleware/auth';

const router = Router();

router.post(
  '/generate',
  auth(USER_ROLE.admin, USER_ROLE.administrator),
  codeController.createCodes,
);
router.post('/validate', codeController.validateCode);
router.get('/churchmember/:id', codeController.getMemberbyChurchId);

router.get('/codes', auth(USER_ROLE.administrator), codeController.getAllUser);
router.get('/', auth(USER_ROLE.administrator), codeController.getAllCodes);

export const codeGeneratorRoutes = router;
