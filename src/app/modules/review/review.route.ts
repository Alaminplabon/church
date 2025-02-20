import { Router } from 'express';
import { reviewController } from './review.controller';
import { USER_ROLE } from '../user/user.constants';
import auth from '../../middleware/auth';

const router = Router();

router.post(
  '/create-review',
  auth(USER_ROLE.member, USER_ROLE.administrator),
  reviewController.createreview,
);

router.patch('/update/:id', reviewController.updatereview);

router.delete('/:id', reviewController.deletereview);
router.get('/myreview', auth(USER_ROLE.member), reviewController.getreviewById);
router.get('/user/:id', reviewController.getUserById);
// router.get('/:id', reviewController.getreviewById);
router.get('/', reviewController.getAllreview);

export const reviewRoutes = router;
