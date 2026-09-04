import { generateGeminiResponse } from "./providers/gemini.provider.js";
import { getPersona } from "./persona.js";

const generateAIResponse = async ({ persona, messages }) => {
    const selectedPersona = getPersona(persona);

    const formattedMessages = messages
        .map((message) => {
            return `${message.role.toUpperCase()}: ${message.content}`;
        })
        .join("\n");

    const prompt = `
${selectedPersona.systemPrompt}

Conversation History:
${formattedMessages}

Respond to the latest user message according to your role and the conversation context.
`;

    const response = await generateGeminiResponse(prompt);

    return response;
};

export { generateAIResponse };