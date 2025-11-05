/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { GoogleGenerativeAI } from "@google/generative-ai";

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  const { prompt } = req.body || {};

  try {
    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt || "Hello from Pagume AI!");
    const reply = result.response.text();
    res.status(200).json({ reply });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: err.message });
  }
}

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