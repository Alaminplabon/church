import { Router } from 'express';
import { activityController } from './activity.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import multer, { memoryStorage } from 'multer';
import parseData from '../../middleware/parseData';

const router = Router();
const storage = memoryStorage();
const upload = multer({ storage });
router.post(
  '/create-activity',
  auth(USER_ROLE.member),
  upload.fields([{ name: 'images', maxCount: 5 }]),
  parseData(),
  activityController.createActivity,
);

router.patch('/update/:id', activityController.updateActivity);

router.get('/my-activity/:id', activityController.getByMemberId);
router.get(
  '/my-activity',
  auth(USER_ROLE.member),
  activityController.getActivitiesByMemberId,
);

router.delete('/:id', activityController.deleteActivity);

router.get('/:id', activityController.getActivityById);
router.get('/', activityController.getAllActivities);

export const activityRoutes = router;
