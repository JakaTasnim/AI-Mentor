import { Router } from "express";
import { createMessage } from "../controllers/message.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.use(verifyJWT);

router.route("/:conversationId/messages").post(createMessage)

export default router;