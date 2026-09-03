import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { 
    createConversation,
    getUserConversations, 
    getConversationById, 
    deleteConversation 
} from "../controllers/conversation.controller.js"

const router = Router();

router.use(verifyJWT);
router.route("/").post(createConversation).get(getUserConversations);
router.route("/:conversationId").get(getConversationById).delete(deleteConversation);

export default router;
