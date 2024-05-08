import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import * as chatControllers from "../controllers/chatControllers.js";

const router = Router();

router.route("/").post(protect, chatControllers.accessChat);
router.route("/").get(protect, chatControllers.fetchChats);
router.route("/creategroup").post(protect, chatControllers.createGroupChat);
router.route("/editgroup").put(protect, chatControllers.editGroup);
router.route("/groupadd").put(protect, chatControllers.addToGroup);
router.route("/groupremove").put(protect, chatControllers.removeFromGroup);
router.route("/groupadmin").put(protect, chatControllers.makeGroupAdmin);
router
  .route("/groupremoveadmin")
  .put(protect, chatControllers.removeGroupAdmin);

export default router;
