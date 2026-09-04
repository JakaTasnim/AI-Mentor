import { generateGeminiResponse, streamGeminiResponse } from "./providers/gemini.provider.js";
import { getPersona } from "./persona.js";



const buildPrompt = ({ persona, messages }) => {
    const selectedPersona = getPersona(persona);

    const formattedMessages = messages
        .map((message) => {
            return `${message.role.toUpperCase()}: ${message.content}`;
        })
        .join("\n");

    return `
${selectedPersona.systemPrompt}

Conversation History:
${formattedMessages}

Respond to the latest user message according to your role and the conversation context.
`;
};

const generateAIResponse = async ({ persona, messages }) => {
    const prompt = buildPrompt({
        persona,
        messages
    });

    return await generateGeminiResponse(prompt);
};


const streamAIResponse = async ({
    persona,
    messages,
    onChunk
}) => {
    const prompt = buildPrompt({
        persona,
        messages
    });

    return await streamGeminiResponse(
        prompt,
        onChunk
    );
};


export {
    generateAIResponse,
    streamAIResponse
};