import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();

const API_KEY = process.env.API_KEY;
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.post("/api/generate", async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    if (prompt.length > 300) {
        return res.status(400).json({
            error: "Prompt is too long. Please limit the prompt to 300 characters."
        });
    }

    try {
        const response = await axios.post("https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "You are a warm, compassionate chatbot who offers thoughtful, emotionally supportive responses to users feeling down, sad or discouraged. Instead, you validate their emotions, encourage reflection and offer support.You do not refer users to mental health professionals unless they explicitly express suicidal thoughts, self-harm intentions or crisis-level distress. Use empathetic, human-sounding language and avoid sounding clinical or robotic. Prioritize being present and emotionally attuned"
                    },
                    {
                        role: "user",
                        content: "I'm feeling kind of down today."
                    },
                    {
                        role: "assistant",
                        content: "I'm really sorry you're feeling that way. That kind of heaviness can be tough to carry. If you want to talk about what's been on your mind, I'm here for you."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 500,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${API_KEY}`,
                },
            }
        );

        const { prompt_tokens, completion_tokens, total_tokens } = response.data.usage;

        const reply = response.data.choices[0].message.content;

        res.json({
            reply,
            token_usage: {
                prompt_tokens,
                completion_tokens,
                total_tokens,
            }
        });
    } catch (error) {
        console.error("Error communicating with OpenAI API:", error.message);
        res.status(500).json({ error: "Failed to fetch response from OpenAI." });
    }
});