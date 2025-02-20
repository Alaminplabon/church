import { Router } from 'express';
import { networkController } from './network.controller';
import { USER_ROLE } from '../user/user.constants';
import auth from '../../middleware/auth';

const router = Router();

router.post(
  '/send-request',
  auth(USER_ROLE.member),
  networkController.sendFriendRequest,
);

router.patch(
  '/accept-request/:sender',
  auth(USER_ROLE.member),
  networkController.acceptFriendRequest,
);

router.patch(
  '/reject-request/:sender',
  auth(USER_ROLE.member),
  networkController.rejectFriendRequest,
);

// router.post('/send-message', networkController.sendMessage);

router.get(
  '/sent-requests',
  auth(USER_ROLE.member),
  networkController.getSentRequests,
);

router.get(
  '/pending-requests',
  auth(USER_ROLE.member),
  networkController.getPendingRequests,
);

router.get(
  '/friends',
  auth(USER_ROLE.member),
  networkController.getFriendsList,
);

router.post(
  '/cancel-friend-request/:receiver',
  auth(USER_ROLE.member),
  networkController.cancelFriendRequest,
);

export const networkRoutes = router;
