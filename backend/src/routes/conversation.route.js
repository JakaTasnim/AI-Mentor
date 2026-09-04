import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { 
    createConversation,
    getUserConversations, 
    getConversationById, 
    deleteConversation,
    updateConversation 
} from "../controllers/conversation.controller.js"

const router = Router();

router.use(verifyJWT);
router.route("/").post(createConversation).get(getUserConversations);
router.route("/:conversationId").get(getConversationById).patch(updateConversation).delete(deleteConversation);

export default router;
