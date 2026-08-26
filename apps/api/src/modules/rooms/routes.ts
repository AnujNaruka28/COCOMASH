import { Router } from 'express';
import roomController from './controller.js';
import { validateBody, validateParams } from '../../common/middleware/validate.js';
import { createRoomSchema, getRoomByIdSchema } from './dto.js';

const router: Router = Router();

router.post('/rooms',validateBody(createRoomSchema), roomController.createRoom);
router.get('/rooms/:id',validateParams(getRoomByIdSchema), roomController.getRoomById);

export { router as roomsRouter };