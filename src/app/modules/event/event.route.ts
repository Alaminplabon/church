import { Router } from 'express';
import { eventController } from './event.controller';
import { USER_ROLE } from '../user/user.constants';
import auth from '../../middleware/auth';
import multer, { memoryStorage } from 'multer';
import parseData from '../../middleware/parseData';

const router = Router();
const storage = memoryStorage();
const upload = multer({ storage });

router.post(
  '/create-event',
  auth(USER_ROLE.administrator),
  upload.fields([{ name: 'images', maxCount: 5 }]),
  parseData(),
  eventController.createEvent,
);
router.get(
  '/eventchurch',
  auth(USER_ROLE.administrator),
  eventController.getAllChurchEvents,
);

router.get('/churchevent/:id', eventController.getEventbyChurchId);
router.patch(
  '/update/:id',
  upload.fields([{ name: 'images', maxCount: 5 }]),
  parseData(),
  eventController.updateEvent,
);

router.delete('/:id', eventController.deleteEvent);

router.get('/:id', eventController.getEventById);
router.get('/', eventController.getAllEvents);

export const eventRoutes = router;
