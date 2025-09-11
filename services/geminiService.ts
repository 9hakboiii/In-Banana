import { GoogleGenAI, Modality, Part } from "@google/genai";
import { ElementType } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const buildPrompt = (
  elements: { id: ElementType; data: string; mimeType: string }[],
  additionalRequest: string
): string => {
  let prompt = "Edit the main reference image. ";
  
  if (elements.length > 0) {
    prompt += "Incorporate the following elements from the other images provided: ";
    const elementDescriptions = elements.map(el => `a new '${el.id}'`);
    prompt += elementDescriptions.join(', ') + ". ";
  }
  
  if (additionalRequest.trim()) {
    prompt += `Additionally, follow this specific instruction: "${additionalRequest.trim()}".`;
  }

  // If no elements and no text, provide a generic instruction
  if (elements.length === 0 && !additionalRequest.trim()) {
      return "Slightly enhance the provided image.";
  }

  return prompt;
};

export const editImageWithElements = async (
  mainImage: { data: string; mimeType: string },
  elements: { id: ElementType; data: string; mimeType: string }[],
  additionalRequest: string
): Promise<string | null> => {
  try {
    const promptText = buildPrompt(elements, additionalRequest);

    const textPart: Part = { text: promptText };
    const mainImagePart: Part = { inlineData: { data: mainImage.data, mimeType: mainImage.mimeType } };
    const elementImageParts: Part[] = elements.map(el => ({
      inlineData: {
        data: el.data,
        mimeType: el.mimeType,
      },
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [mainImagePart, ...elementImageParts, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    
    const textResponse = response.text;
    if (textResponse) {
      throw new Error(`Model responded with text: ${textResponse}`);
    }

    return null;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate image. Please check your inputs and try again.");
  }
};