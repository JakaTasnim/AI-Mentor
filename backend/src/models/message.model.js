import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
    {
        conversation : {
            type : Schema.Types.ObjectId,
            ref : "Conversation",
            required : true,
            index : true
        },
        role : {
            type : String,
            enum : ["user", "assistant"],
            required : true
        },
        content : {
            type : String,
            required : true,
            trim : true
        }
    },
    {
        timestamps : true
    }
);

export const Message = mongoose.model("Message", messageSchema)