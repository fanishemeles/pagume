import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export default async function handler(req, res) {
  const { prompt } = req.body || {};

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt || "Hello from Pagume AI!",
    });

    res.status(200).json({ reply: response.response.text() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
