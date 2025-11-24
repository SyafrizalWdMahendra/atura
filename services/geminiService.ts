import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION, MODEL_NAME } from '../constants';

let chatInstance: Chat | null = null;

export const initializeChat = async () => {
  if (chatInstance) {
    return; // Already initialized
  }
  
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not defined in the environment variables.");
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    chatInstance = ai.chats.create({
      model: MODEL_NAME,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
    console.log("Gemini chat initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize Gemini chat:", error);
    throw error;
  }
};

export const sendMessage = async (message: string, onChunk: (chunk: string) => void) => {
  if (!chatInstance) {
    throw new Error("Chat not initialized. Call initializeChat first.");
  }

  try {
    const responseStream = await chatInstance.sendMessageStream({ message: message });
    for await (const chunk of responseStream) {
      const c = chunk as GenerateContentResponse; // Type assertion for chunk
      onChunk(c.text || '');
    }
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw error;
  }
};
