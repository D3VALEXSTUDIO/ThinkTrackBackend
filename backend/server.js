import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/ai-chat", async (req, res) => {
  const { message } = req.body;

  const prompt = `
You are a strict tutor.
Only give hints, never answers.

Student: ${message}
`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });

    res.json({
      reply: response.choices[0].message.content
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ IMPORTANT FOR RENDER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});