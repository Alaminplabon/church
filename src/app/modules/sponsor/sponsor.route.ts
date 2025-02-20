import { Router } from 'express';
import { sponsorController } from './sponsor.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

const router = Router();

router.post(
  '/create-sponsor',
  auth(USER_ROLE.member, USER_ROLE.administrator),
  sponsorController.createSponsor,
);
router.post('/confirm-payment', sponsorController.confirmSponsorPayment);
// router.patch('/update/:id', sponsorController);
router.delete('/:id', sponsorController.deleteSponsor);

router.get('/sponsor-with-church', sponsorController.getSponsorsWithChurchId);
router.get('/sponsor-no-church', sponsorController.getSponsorsWithNoChurch);

router.get(
  '/calculate-amount/:churchId',
  sponsorController.calculateSponsorAmount,
);
router.get('/total-spent', sponsorController.getTotalSpent);
router.get('/:id', sponsorController.getSponsorById);
router.get(
  '/',
  auth(USER_ROLE.member, USER_ROLE.administrator),
  sponsorController.getAllSponsors,
);

export const sponsorRoutes = router;
