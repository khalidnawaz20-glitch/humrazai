const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// DeepSeek API configuration
const DEEPSEEK_API = "https://api.deepseek.com/v1/chat/completions";
const DEEPSEEK_KEY = "sk-18f93***********************763c"; // Replace with your key

// Chat endpoint
app.post('/chat', async (req, res) => {
    const { message, language } = req.body;

    if (!message || message.trim() === "") {
        return res.json({ reply: "Please type something!", emotionAvatar: null });
    }

    try {
        const response = await fetch(DEEPSEEK_API, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${DEEPSEEK_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    {
                        role: "system",
                        content: "You are HumraazAI, a friendly virtual companion. Reply naturally in the user’s selected language (English or Hinglish/Urdu). Keep responses short and conversational."
                    },
                    { role: "user", content: message }
                ]
            })
        });

        const data = await response.json();
        let reply = (data.choices && data.choices[0].message)
            ? data.choices[0].message.content.trim()
            : "Hmm… interesting! Tell me more.";

        res.json({ reply, emotionAvatar: null });

    } catch (err) {
        console.error("DeepSeek API error:", err);
        res.json({ reply: "Bot is not responding right now. Try again later.", emotionAvatar: null });
    }
});

// Serve static frontend files
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// Catch-all route for SPA (send index.html)
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`HumraazAI backend running at http://localhost:${PORT}`);
});
