import { Router } from 'express';
import roomController from './controller.js';
import { validateBody, validateParams, validateQuery } from '../../common/middleware/validate.js';
import { createRoomSchema, getRoomByIdSchema, paginationSchema } from './dto.js';

const router: Router = Router();

router.post('/rooms', validateBody(createRoomSchema), roomController.createRoom);
router.get('/rooms', validateQuery(paginationSchema), roomController.getAllRooms);  
router.get('/rooms/:id', validateParams(getRoomByIdSchema), roomController.getRoom);

export { router as roomsRouter };