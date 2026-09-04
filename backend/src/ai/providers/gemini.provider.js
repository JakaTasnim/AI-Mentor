import { GoogleGenAI } from "@google/genai";
import { ApiError } from "../../utils/ApiError.js";


const gemini = new GoogleGenAI({
    apiKey : process.env.GEMINI_API_KEY
})

const generateGeminiResponse = async (prompt) => {
    try {
        const interaction = await gemini.interactions.create({
            model: "gemini-3.8-flash",
            input: prompt
        });

        return interaction.output_text;
    } catch (error) {
        console.error("Gemini Error:", error);

        if (
            error?.status === 429 ||
            error?.statusCode === 429 ||
            error?.message?.includes("429")
        ) {
            throw new ApiError(
                429,
                "AI service quota exceeded. Please try again shortly."
            );
        }

        throw new ApiError(
            500,
            "AI service is temporarily unavailable."
        );
    }
};

const streamGeminiResponse = async (prompt, onChunk) => {
    const stream = await gemini.interactions.create({
        model: "gemini-3.8-flash",
        input: prompt,
        stream: true
    });

    let fullResponse = "";

    for await (const chunk of stream) {
        console.log("STREAM CHUNK:", chunk);
        const text = chunk.output_text || "";

        if (text) {
            fullResponse += text;
            onChunk(text);
        }
    }

    return fullResponse;
};

export {
    generateGeminiResponse,
    streamGeminiResponse
}