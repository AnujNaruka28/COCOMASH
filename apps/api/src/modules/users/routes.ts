import { Router } from "express";
import { userController } from "./controller.js";

const router: Router = Router();

router.post("/", userController.createOrGetUser);
router.get("/:id", userController.getUserById);

export default router;
