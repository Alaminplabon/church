import { Router } from 'express';
import { prayerRequestController } from './prayerrequest.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

const router = Router();

router.post(
  '/create-prayerrequest',
  auth(USER_ROLE.member),
  prayerRequestController.createPrayerRequest,
);

// router.patch('/update/:id', prayerRequestController.);

router.delete('/:id', prayerRequestController.deletePrayerRequest);

router.get(
  '/myrequest',
  auth(USER_ROLE.member, USER_ROLE.administrator),
  prayerRequestController.getPrayerRequestByMemberId,
);
router.get(
  '/churchrequest/:churchId',
  // auth(USER_ROLE.administrator),
  prayerRequestController.getPrayerRequestByChurchId,
);

router.get('/:id', prayerRequestController.getPrayerRequestById);
router.get('/', prayerRequestController.getAllPrayerRequests);

export const prayerrequestRoutes = router;
