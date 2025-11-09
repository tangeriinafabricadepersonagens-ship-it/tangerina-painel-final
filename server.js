// server.js
import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import fs from "fs-extra";

dotenv.config();

const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const COMMERCIAL_NUMBER = process.env.COMMERCIAL_NUMBER;

// Caminho do arquivo de leads
const LEADS_FILE = "./leads.json";

// 🔁 Carrega os leads do arquivo JSON
let leads = {};
if (fs.existsSync(LEADS_FILE)) {
  leads = fs.readJsonSync(LEADS_FILE);
  console.log(`📂 Leads carregados: ${Object.keys(leads).length}`);
}

// 🧠 Salva leads no arquivo JSON
function salvarLeads() {
  fs.writeJsonSync(LEADS_FILE, leads, { spaces: 2 });
  console.log("💾 Leads salvos em leads.json");
}

// ✅ Verificação do Webhook
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token && mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado com sucesso!");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// 💬 Recebe mensagens do WhatsApp
app.post("/webhook", async (req, res) => {
  try {
    if (req.body.entry?.[0].changes?.[0].value?.messages) {
      const message = req.body.entry[0].changes[0].value.messages[0];
      const from = message.from;
      const text = message.text?.body?.toLowerCase() || "";

      if (!leads[from]) {
        leads[from] = {
          etapa: 0,
          perfil: "",
          interesse: "",
          status: "novo",
          atualizado: new Date().toISOString(),
        };
      }

      const lead = leads[from];

      // Fluxo do funil
      if (lead.etapa === 0) {
        await sendMessage(
          from,
          "👋 Oi, tudo bem? Aqui é o Bruno da *Tangerina IA*! Posso te ajudar a criar aquele vídeo incrível com IA que chamou sua atenção? 🚀"
        );
        lead.etapa = 1;
      } else if (lead.etapa === 1) {
        lead.interesse = text;
        await sendMessage(
          from,
          "Pra eu entender melhor 🍊\nVocê é:\n1️⃣ Social Media\n2️⃣ Empresário / Marca\n3️⃣ Criador de Conteúdo"
        );
        lead.etapa = 2;
      } else if (lead.etapa === 2) {
        if (text.includes("1")) lead.perfil = "Social Media";
        else if (text.includes("2")) lead.perfil = "Empresário / Marca";
        else if (text.includes("3")) lead.perfil = "Criador de Conteúdo";
        else lead.perfil = "Não informado";

        await sendMessage(
          from,
          "Show! 😎 E o que você quer destacar com o vídeo?\n📹 Produto / serviço\n💬 Conteúdo pra redes sociais\n✨ Institucional\n💡 Outro tipo de ideia"
        );
        lead.etapa = 3;
      } else if (lead.etapa === 3) {
        lead.interesse = text;
        await sendMessage(
          from,
          "Entendi 🍊 E quando você quer começar esse vídeo?\n⏱️ Ainda pesquisando\n⚙️ Nos próximos dias\n🔥 Já quero começar agora"
        );
        lead.etapa = 4;
      } else if (lead.etapa === 4) {
        if (text.includes("⏱️") || text.includes("pesquisando")) lead.status = "Frio";
        else if (text.includes("⚙️") || text.includes("dias")) lead.status = "Morno";
        else if (text.includes("🔥") || text.includes("agora")) lead.status = "Quente";

        if (lead.status === "Quente") {
          await sendMessage(
            from,
            "Incrível! 🚀 Vou te conectar com nosso atendimento comercial 🍊..."
          );
          const resumo = `🧾 *Novo lead quente!*\n👤 Cliente: ${from}\n💼 Perfil: ${lead.perfil}\n🎯 Interesse: ${lead.interesse}\n📞 Telefone: ${from}`;
          await sendMessage(COMMERCIAL_NUMBER, resumo);
        } else {
          await sendMessage(
            from,
            "Perfeito 🍊! Vou te mandar alguns exemplos de vídeos pra se inspirar, pode ser?"
          );
        }

        lead.etapa = 5;
      }

      lead.atualizado = new Date().toISOString();

      salvarLeads(); // 🔥 salva automaticamente
      console.log("🧠 Lead atualizado:", lead);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Erro no webhook:", error.response?.data || error.message);
    res.sendStatus(500);
  }
});

// 📤 Enviar mensagens pelo WhatsApp API
async function sendMessage(to, message) {
  try {
    await axios.post(
      `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        text: { body: message },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    );
    console.log("✅ Mensagem enviada para", to);
  } catch (error) {
    console.error("❌ Erro ao enviar mensagem:", error.response?.data || error.message);
  }
}

// 🔍 Endpoints para o painel
app.get("/api/leads", (req, res) => {
  res.json(leads);
});

app.get("/api/status", (req, res) => {
  res.json({
    status: "online",
    leadsCount: Object.keys(leads).length,
  });
});

// 🚀 Inicializa o servidor
app.listen(process.env.PORT || 3000, () => {
  console.log(`✅ Servidor rodando na porta ${process.env.PORT || 3000}`);
});
