import { GoogleGenAI } from "@google/genai";


const gemini = new GoogleGenAI({
    apiKey : process.env.GEMINI_API_KEY
})

const generateGeminiResponse = async (prompt) => {
    const interaction = await gemini.interactions.create({
        model: "gemini-3.8-flash",
        input : prompt
    });

    return interaction.output_text;
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