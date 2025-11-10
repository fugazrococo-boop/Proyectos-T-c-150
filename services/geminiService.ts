import { GoogleGenAI } from "@google/genai";

// FIX: Per coding guidelines, initialize GoogleGenAI client assuming API_KEY is present in the environment.
// This removes unnecessary checks and variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const improveDescription = async (currentDescription: string): Promise<string> => {
  if (!currentDescription.trim()) {
    return "Please provide a basic project description first.";
  }

  const prompt = `You are an expert educational curriculum designer. Rewrite and enhance the following description for a school project. Make it more engaging, clear, and structured for tracking purposes. The output should be only the improved description, without any introductory phrases.
  
  Original description: "${currentDescription}"
  
  Improved description:`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get suggestion from AI. Please try again.");
  }
};
