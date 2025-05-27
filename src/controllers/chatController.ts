// https://ai.google.dev/gemini-api/docs

import { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY must be set in environment variables");
}

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const chatWithGemini = async (req: Request, res: Response) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Missing 'message' in request body" });
  }

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: userMessage,
      config: {
        systemInstruction: "You are a helpful and knowledgeable financial assistant. Always provide clear and concise explanations related to personal finance, budgets, and transactions.",
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    });

    return res.status(200).json({ answer: response.text });
  } catch (error) {
    console.error("Gemini API error:", error);
    return res.status(500).json({ error: "Failed to generate response from Gemini" });
  }
};
