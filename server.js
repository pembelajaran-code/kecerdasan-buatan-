const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  console.log("Received request:", req.body); // Log untuk debugging
  const { message } = req.body;

  const body = {
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    messages: [
      {
        role: "system",
        content: `Kamu adalah AbidinAI...` // Isi prompt lengkap
      },
      { role: "user", content: message }
    ],
    temperature: 0.7,
    max_tokens: 1024
  };

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    console.log("Groq response:", data); // Log respons dari Groq
    const reply = data.choices?.[0]?.message?.content || "Maaf, tidak ada balasan.";
    res.json({ reply });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/alarm', (req, res) => {
  res.sendFile(__dirname + '/alarm.html');
});

module.exports = app; // Penting untuk Vercel!

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => console.log(`🚀 Server lokal berjalan di port ${PORT}`));
}
