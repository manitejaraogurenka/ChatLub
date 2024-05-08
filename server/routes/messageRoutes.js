import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { sendMessage } from "../controllers/messagesControllers.js";
import { allMessages } from "../controllers/messagesControllers.js";

const router = Router();

router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, allMessages);

export default router;
