import { GoogleGenAI } from "@google/genai";
import { BotConfig, ChatMessage } from "../types";

const getSystemPrompt = (config: BotConfig): string => {
  return `
    ATUAÇÃO: ${config.assistantName}, Assistente da ${config.companyName}.
    TOM DE VOZ: ${config.tone}.
    TELEFONE DE CONTATO: ${config.contactPhone}.
    
    INSTRUÇÕES DO SISTEMA:
    ${config.systemInstruction}
    
    BASE DE CONHECIMENTO RÁPIDO:
    ${config.knowledgeBase}
    
    DIRETRIZES:
    1. Responda de forma concisa em chats.
    2. Se não souber a resposta, peça para o cliente aguardar o atendimento humano.
    3. Formate a resposta de maneira legível para WhatsApp (use quebras de linha).
  `;
};

export const sendMessageToGemini = async (
  history: ChatMessage[],
  newMessage: string,
  config: BotConfig
): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key not found in environment variables.");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Transform internal history to Gemini format if needed, 
    // but for single turn or simple context we can just use the system instruction + last few messages
    // Ideally, we use the chat feature.
    
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: getSystemPrompt(config),
        temperature: 0.7,
      },
      history: history.filter(h => !h.isError).map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({
      message: newMessage
    });

    return result.text || "Desculpe, não consegui processar sua solicitação no momento.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Ocorreu um erro ao conectar com o assistente inteligente. Por favor, tente novamente.";
  }
};