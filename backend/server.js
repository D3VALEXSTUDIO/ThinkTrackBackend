import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// 🔐 OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 🧠 AI CHAT (TUTOR MODE)
app.post("/ai-chat", async (req, res) => {
  const { message, context } = req.body;

  const prompt = `
You are a STRICT educational tutor.

RULES:
- DO NOT give full answers
- DO NOT complete assignments
- ONLY give hints, guidance, or questions
- Help the student think step-by-step

Student message:
${message}

Context:
${context || "General learning"}

Respond clearly and briefly like a teacher.
`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 200,
      messages: [
        { role: "system", content: "You are a helpful but strict tutor." },
        { role: "user", content: prompt }
      ]
    });

    res.json({
      reply: response.choices[0].message.content
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI request failed" });
  }
});

// 🧪 TEST ROUTE (VERY USEFUL)
app.get("/", (req, res) => {
  res.send("ThinkTrack AI backend is running ✅");
});

// 🚀 REQUIRED FOR RENDER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});