import "dotenv/config";
import { generateGeminiResponse } from "./src/ai/providers/gemini.provider.js";

const testGemini = async () => {
    try {

        const response = await generateGeminiResponse(
            "Explain JavaScript closure in 2 lines."
        );

        console.log("Gemini Response:");
        console.log(response);

    } catch (error) {
        console.error("Gemini Error:", error);
    }
};

testGemini();