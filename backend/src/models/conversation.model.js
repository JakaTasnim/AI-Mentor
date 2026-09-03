import mongoose, { Schema } from "mongoose"


const conversationSchema = new Schema(
    {
        user : {
            type : Schema.Types.ObjectId,
            ref : "User",
            required : true,
            index : true,
        },
        title : {
            type : String,
            trim : true,
            default : "New Conversation"
        },
        persona : {
            type : String,
            enum : ["technical", "career"],
            default : "technical",
            required : true
        }
    },
    {
        timestamps : true
    }
);

export const Conversation = mongoose.model("Conversation", conversationSchema)