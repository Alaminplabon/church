import { Router } from 'express';
import { churchController } from './church.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import multer, { memoryStorage } from 'multer';
import parseData from '../../middleware/parseData';

const router = Router();
const storage = memoryStorage();
const upload = multer({ storage });

router.post(
  '/create',
  auth(USER_ROLE.admin, USER_ROLE.administrator),
  upload.fields([{ name: 'images', maxCount: 5 }]),
  parseData(),
  churchController.createChurch,
);
router.patch(
  '/:id',
  upload.fields([
    { name: 'images', maxCount: 5 },
    // { name: 'bannerImage', maxCount: 1 },
  ]),
  parseData(),
  churchController.updateChurch,
);
router.delete('/:id', churchController.deleteChurch);

router.get(
  '/church-sponsor/:id',
  auth(USER_ROLE.administrator),
  churchController.getChurchSponsor,
);

router.get(
  '/mychurch',
  auth(USER_ROLE.administrator),

  churchController.getChurchById,
);
router.get('/:id', churchController.getSingleChurch);
router.get('/', churchController.getAllChurch);

export const churchRoutes = router;
