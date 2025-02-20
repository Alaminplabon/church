import { Router } from 'express';
import { workController } from './work.controller';
import multer, { memoryStorage } from 'multer';
import parseData from '../../middleware/parseData';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

const router = Router();
const storage = memoryStorage();
const upload = multer({ storage });

router.post(
  '/create-work',
  auth(USER_ROLE.member),
  upload.fields([{ name: 'images', maxCount: 5 }]),
  parseData(),
  workController.createWork,
);
router.get('/member/:id', workController.getWorkByMemberId);

router.patch(
  '/update/:id',
  upload.fields([{ name: 'images', maxCount: 5 }]),
  parseData(),
  workController.updateWork,
);

router.delete('/:id', workController.deleteWork);
router.get('/my-work/:id', workController.getMyWorkById);
router.get(
  '/my-work',
  auth(USER_ROLE.member),
  workController.getWorkByMemberId,
);
router.get('/:id', workController.getWorkById);
router.get('/', workController.getAllWork);

export const workRoutes = router;
