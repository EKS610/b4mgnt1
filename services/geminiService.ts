
import { GoogleGenAI } from "@google/genai";

// Fix: Initialize GoogleGenAI using the process.env.API_KEY directly as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateVMSExplanation = async (topic: string, specificPrompt: string): Promise<string> => {
  try {
    // Fix: Using 'gemini-3-flash-preview' for basic text tasks and ensuring correct property access for response text.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an expert on Visitor Management Systems (VMS). 
      Please explain the following concept related to VMS clearly and professionally for a corporate audience.
      
      Topic: ${topic}
      Context: ${specificPrompt}
      
      Format the response with Markdown headers and bullet points where appropriate. Keep it concise but informative (under 300 words).`,
    });

    return response.text || "No explanation generated.";
  } catch (error) {
    console.error("Error generating content:", error);
    return "Failed to generate explanation. Please try again later.";
  }
};

export const askGeneralQuestion = async (question: string): Promise<string> => {
  try {
    // Fix: Using 'gemini-3-flash-preview' for general Q&A as per guidelines.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a helpful assistant for a Visitor Management System dashboard. 
      Answer the user's question about VMS operations, security, or best practices.
      
      Question: ${question}`,
    });
    return response.text || "I couldn't generate an answer.";
  } catch (error) {
    console.error("Error answering question:", error);
    return "Error contacting AI service.";
  }
};
