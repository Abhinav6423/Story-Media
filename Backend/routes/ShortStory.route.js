import { createShortStory, listShortStory, openShortStory, updateShortStory, deleteShortStory, listUserShortStory, openUserShortStory, userAnswer } from "../controllers/ShorStory.controller.js";
import express from "express";
import verifyToken from "../middlewares/VerifyToken.middleware.js";
const router = express.Router();


// creator panel
router.post("/", verifyToken, createShortStory);
router.put("/:storyId", verifyToken, updateShortStory);
router.delete("/:storyId", verifyToken, deleteShortStory);
router.get("/me", verifyToken, listUserShortStory);
router.get("/me/:storyId", verifyToken, openUserShortStory);

// user panel
router.get("/", verifyToken, listShortStory);
router.get("/:storyId", verifyToken, openShortStory);
router.post("/:storyId/answer", verifyToken, userAnswer);

export default router;