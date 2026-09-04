import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateAIResponse } from "../ai/ai.service.js";

const createMessage = asyncHandler(async (req, res) => {

    const { conversationId } = req.params;
    const { content } = req.body;

    // 1. Validate message
    if (!content || content.trim() === "") {
        throw new ApiError(400, "Message content is required");
    }

    // 2. Check conversation + ownership
    const conversation = await Conversation.findOne({
        _id: conversationId,
        user: req.user._id
    });

    if (!conversation) {
        throw new ApiError(404, "Conversation not found");
    }

    // 3. Save user's message
    const userMessage = await Message.create({
        conversation: conversation._id,
        role: "user",
        content: content.trim()
    });

    // 4. Get conversation history
    const messages = await Message.find({
        conversation: conversation._id
    }).sort({ createdAt: 1 });

    // 5. Ask AI
    const aiResponse = await generateAIResponse({
        persona: conversation.persona,
        messages
    });

    // 6. Save AI's response
    const assistantMessage = await Message.create({
        conversation: conversation._id,
        role: "assistant",
        content: aiResponse
    });

    // 7. Update conversation time
    await Conversation.findByIdAndUpdate(
        conversation._id,
        {
            $set: {
                updatedAt: new Date()
            }
        }
    );

    // 8. Send response
    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                {
                    userMessage,
                    assistantMessage
                },
                "AI response generated successfully"
            )
        );
});

export { createMessage };