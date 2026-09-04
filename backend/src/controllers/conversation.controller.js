import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const createConversation = asyncHandler(async (req, res) => {
    const { title, persona } = req.body;

    if (persona && !["technical", "career"].includes(persona)) {
        throw new ApiError(400, "Invalid persona");
    }

    const conversation = await Conversation.create({
        user: req.user._id,
        title: title?.trim() || "New Conversation",
        persona: persona || "technical"
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                conversation,
                "Conversation created successfully"
            )
        );
});

const getUserConversations = asyncHandler(async (req, res) => {
    const conversations = await Conversation.find({
        user: req.user._id
    }).sort({
        updatedAt: -1
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                conversations,
                "Conversations fetched successfully"
            ));
});

const getConversationById = asyncHandler(async (req, res) => {
    const { conversationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
        throw new ApiError(400, "Invalid conversation id");
    }

    const conversation = await Conversation.findOne({
        _id: conversationId,
        user: req.user._id
    });

    if (!conversation) {
        throw new ApiError(
            404,
            "Conversation not found"
        );
    }

    const messages = await Message.find({
        conversation: conversation._id
    }).sort({
        createdAt: 1
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    conversation,
                    messages
                },
                "Conversation fetched successfully"
            )
        );
})

const updateConversation = asyncHandler(async (req, res) => {
    const { conversationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
        throw new ApiError(400, "Invalid conversation id");
    }
    const { title, persona } = req.body;

    if (!title && !persona) {
        throw new ApiError(
            400,
            "Title or persona is required"
        );
    }

    if (
        persona &&
        !["technical", "career"].includes(persona)
    ) {
        throw new ApiError(
            400,
            "Invalid persona"
        );
    }

    const conversation = await Conversation.findOne({
        _id: conversationId,
        user: req.user._id
    });

    if (!conversation) {
        throw new ApiError(
            404,
            "Conversation not found"
        );
    }

    if (title) {
        conversation.title = title.trim();
    }

    if (persona) {
        conversation.persona = persona;
    }

    await conversation.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                conversation,
                "Conversation updated successfully"
            )
        );
});

const deleteConversation = asyncHandler(async (req, res) => {
    const { conversationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
        throw new ApiError(400, "Invalid conversation id");
    }

    const conversation = await Conversation.findOne({
        _id: conversationId,
        user: req.user._id
    });

    if (!conversation) {
        throw new ApiError(
            404,
            "Conversation not found"
        );
    }

    await Message.deleteMany({
        conversation: conversation._id
    });

    await Conversation.findByIdAndDelete(
        conversation._id
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Conversation deleted succeessfully"
            )
        );
})

export {
    createConversation,
    getUserConversations,
    getConversationById,
    deleteConversation,
    updateConversation
};