import { Router } from 'express';
import { bookEventController } from './bookevent.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

const router = Router();

router.post(
  '/create-bookevent',
  auth(USER_ROLE.member),
  bookEventController.createBookEvent,
);

// router.patch('/update/:id', bookEventController.);

router.delete('/:id', bookEventController.deleteBookedEvent);
router.get(
  '/myevent',
  auth(USER_ROLE.member),
  bookEventController.getBookedEventByMemderId,
);
router.get('/attendees/:eventId', bookEventController.getAllUserByEvents);
router.get('/:id', bookEventController.getBookedEventById);
router.get('/', bookEventController.getAllBookedEvents);

export const bookeventRoutes = router;
