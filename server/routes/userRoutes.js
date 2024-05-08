import { Router } from "express";
import * as controller from "../controllers/userControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.route("/").post(controller.registerUser).get(controller.getUser);
router.route("/login").post(controller.authUser);
router.route("/users").get(protect, controller.allUsers);
router.route("/edituser").put(protect, controller.editUser);

export default router;
