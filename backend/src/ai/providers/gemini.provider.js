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

export {
    generateGeminiResponse
}