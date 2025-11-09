import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Carregando variáveis de ambiente
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Credenciais de login (agora vindas do .env)
const USER = process.env.SERVER_USER || "tangeriina";
const PASS = process.env.SERVER_PASS || "galera9$";

// Rota de Login
app.post("/api/login", (req, res) => {
  const { user, pass } = req.body;
  
  if (!user || !pass) {
    return res.status(400).json({ error: "Usuário e senha são obrigatórios" });
  }
  
  if (user === USER && pass === PASS) {
    return res.json({ token: "ok" });
  }
  
  return res.status(401).json({ error: "Credenciais inválidas" });
});

// Rota de IA
app.post("/api/ai", async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ error: "Prompt não pode estar vazio" });
    }
    
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("Erro: OPENAI_API_KEY não configurada");
      return res.status(500).json({ error: "Configuração de API não disponível" });
    }
    
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }]
      })
    });
    
    if (!resp.ok) {
      const errorData = await resp.json();
      console.error("Erro da API OpenAI:", errorData);
      return res.status(resp.status).json({ error: "Erro ao comunicar com a IA" });
    }
    
    const data = await resp.json();
    const reply = data.choices?.[0]?.message?.content || "Sem resposta da IA";
    
    res.json({ reply });
  } catch (err) {
    console.error("Erro ao processar requisição de IA:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Servir arquivos estáticos do React build
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "build")));

// Fallback para SPA (Single Page Application)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Iniciar servidor
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
  console.log(`📍 Acesse: http://localhost:${PORT}`);
});
