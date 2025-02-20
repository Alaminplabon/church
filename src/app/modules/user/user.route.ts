import { Router } from 'express';
import { userController } from './user.controller';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import { USER_ROLE } from './user.constants';
import parseData from '../../middleware/parseData';
import fileUpload from '../../middleware/fileUpload';
// import { UserValidationSchema } from './user.validation';
import validateAdminData from '../../middleware/validateRequest';
import { userValidation } from './user.validation';
import multer, { memoryStorage } from 'multer';

const router = Router();
const storage = memoryStorage();
const upload = multer({ storage });

router.post(
  '/create',
  upload.single('image'),
  parseData(),
  validateRequest(userValidation.guestValidationSchema),
  userController.createUser,
);

router.patch(
  '/update/:id',
  auth(USER_ROLE.admin, USER_ROLE.administrator),
  upload.single('image'),
  parseData(),
  userController.updateUser,
);

router.patch(
  '/update-my-profile',
  auth(USER_ROLE.admin, USER_ROLE.administrator, USER_ROLE.member),
  upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'bannerImage', maxCount: 1 },
  ]),
  parseData(),
  userController.updateMyProfile,
);

router.delete(
  '/delete-my-account',
  auth(USER_ROLE.admin, USER_ROLE.administrator),
  userController.deleteMYAccount,
);
router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.administrator),
  userController.deleteUser,
);

router.get('/by-year-month/:year', userController.getAllUserByYearandmonth);

router.get(
  '/my-profile',
  auth(USER_ROLE.admin, USER_ROLE.administrator, USER_ROLE.member),
  userController.getMyProfile,
);

router.get('/:id', userController.getUserById);

router.get('/', userController.getAllUser);

export const userRoutes = router;
