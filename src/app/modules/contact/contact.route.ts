import { Router } from 'express';
import { contactController } from './contact.controller';

const router = Router();

router.post('/create-contact', contactController.createcontact);

router.patch('/update/:id', contactController.updatecontact);

router.delete('/:id', contactController.deletecontact);

router.get('/:id', contactController.getcontactById);
router.get('/', contactController.getAllcontact);

export const contactRoutes = router;