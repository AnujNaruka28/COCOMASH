import { Router } from "express";
import { validateBody } from "../../common/middleware/validate.js";
import { executeCodeSchema } from "./dto.js";
import submissionController from "./controller.js";

const router: Router = Router();

router.post('/execute', validateBody(executeCodeSchema), submissionController.executeCode );
router.get('/:submissionId', submissionController.getSubmission );

export { router as submissionsRoutes };