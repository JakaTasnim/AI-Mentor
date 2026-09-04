import mongoose from "mongoose";
import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateAIResponse, streamAIResponse } from "../ai/ai.service.js";


const createMessage = asyncHandler(async (req, res) => {

    const { conversationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
        throw new ApiError(400, "Invalid conversation id");
    }
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
    }).sort({ createdAt: -1 }).limit(20);
    messages.reverse();

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


const streamMessage = asyncHandler(async (req, res) => {
    const { conversationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
        throw new ApiError(400, "Invalid conversation id");
    }
    const { content } = req.body;

    // 1. Validate user message
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

    // 3. Save user message
    const userMessage = await Message.create({
        conversation: conversation._id,
        role: "user",
        content: content.trim()
    });

    // 4. Fetch conversation history
    const messages = await Message.find({
        conversation: conversation._id
    }).sort({ createdAt: -1 }).limit(20);
    messages.reverse();

    // 5. Streaming headers
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    let assistantContent = "";

    try {
        // 6. Start AI streaming
        assistantContent = await streamAIResponse({
            persona: conversation.persona,
            messages,

            onChunk: (chunk) => {
                if (chunk) {
                    res.write(chunk);
                }
            }
        });

        // 7. Protect against empty AI response
        if (!assistantContent || assistantContent.trim() === "") {
            throw new ApiError(
                500,
                "AI returned an empty response"
            );
        }

        // 8. Save assistant message
        const assistantMessage = await Message.create({
            conversation: conversation._id,
            role: "assistant",
            content: assistantContent
        });

        // 9. Update conversation timestamp
        await Conversation.findByIdAndUpdate(
            conversation._id,
            {
                $set: {
                    updatedAt: new Date()
                }
            }
        );

        // 10. End stream
        res.end();

    } catch (error) {
        console.error("Streaming Error:", error);

        // Agar response abhi start nahi hua
        if (!res.headersSent) {
            throw error;
        }

        // Agar streaming already start ho chuki hai
        res.write(
            `\n\n[Error: ${error?.message || "Something went wrong while generating AI response"
            }]`
        );

        res.end();
    }
});

const getConversationMessages = asyncHandler(async (req, res) => {
    const { conversationId } = req.params;

    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.min(
        Math.max(Number(req.query.limit) || 20, 1),
        50
    );

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
        throw new ApiError(400, "Invalid conversation id");
    }

    const conversation = await Conversation.findOne({
        _id: conversationId,
        user: req.user._id
    });

    if (!conversation) {
        throw new ApiError(404, "Conversation not found");
    }

    const skip = (page - 1) * limit;

    const messages = await Message.find({
        conversation: conversation._id
    })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalMessages = await Message.countDocuments({
        conversation: conversation._id
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                messages,
                page,
                limit,
                totalMessages,
                totalPages: Math.ceil(totalMessages / limit)
            },
            "Messages fetched successfully"
        )
    );
});

export {
    createMessage,
    streamMessage,
    getConversationMessages
};