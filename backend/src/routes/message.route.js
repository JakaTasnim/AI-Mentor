import { Router } from "express";
import { createMessage, streamMessage, getConversationMessages } from "../controllers/message.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"


const router = Router()

router.use(verifyJWT);

router.route("/:conversationId/messages").post(createMessage).get(getConversationMessages);
router.route("/:conversationId/messages/stream").post(streamMessage);

export default router;