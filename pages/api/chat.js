/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export default async function handler(req, res) {
  const { prompt } = req.body || {};

  try {
    // Use ML Developer API mode (not Vertex AI)
    const ai = new GoogleGenAI({
      vertexai: false,
      apiKey: GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt || "Hello from Pagume AI!",
    });

    res.status(200).json({ reply: response.response.text() });
  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({ error: error.message });
  }
}