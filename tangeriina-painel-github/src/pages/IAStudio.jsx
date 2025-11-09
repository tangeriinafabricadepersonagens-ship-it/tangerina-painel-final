import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";

export default function IAStudio() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  async function enviar() {
    if (!prompt.trim()) {
      setError("Por favor, digite uma pergunta");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post("/api/ai", { prompt });
      
      if (data.reply) {
        setReply(data.reply);
        setHistory([...history, { prompt, reply: data.reply }]);
        setPrompt("");
      } else {
        setError("Nenhuma resposta recebida da IA");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("auth");
        navigate("/login");
      } else {
        setError(
          err.response?.data?.error || "Erro ao comunicar com a IA. Tente novamente."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  function handleKeyPress(e) {
    if (e.key === "Enter" && e.ctrlKey) {
      enviar();
    }
  }

  function handleLogout() {
    localStorage.removeItem("auth");
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onLogout={handleLogout} />

      <main className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-orange-600 mb-2">🤖 IA Studio</h1>
          <p className="text-gray-600">
            Converse com a IA e obtenha respostas inteligentes
          </p>
        </div>

        {/* Seção de Input */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Sua Pergunta
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            rows="5"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua pergunta aqui... (Ctrl+Enter para enviar)"
            disabled={loading}
          ></textarea>

          <div className="flex gap-3 mt-4">
            <button
              onClick={enviar}
              disabled={loading}
              className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              {loading ? "Processando..." : "Enviar Pergunta"}
            </button>
            <button
              onClick={() => {
                setPrompt("");
                setReply("");
                setError("");
              }}
              disabled={loading}
              className="bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition"
            >
              Limpar
            </button>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Resposta da IA */}
        {reply && (
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Resposta da IA
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                {reply}
              </p>
            </div>
          </div>
        )}

        {/* Histórico */}
        {history.length > 0 && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Histórico de Conversas
            </h2>
            <div className="space-y-4">
              {history.map((item, index) => (
                <div key={index} className="border-l-4 border-orange-500 pl-4 py-2">
                  <p className="text-sm font-medium text-orange-600 mb-1">
                    Pergunta {index + 1}:
                  </p>
                  <p className="text-gray-800 mb-2">{item.prompt}</p>
                  <p className="text-sm font-medium text-green-600 mb-1">
                    Resposta:
                  </p>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">
                    {item.reply.substring(0, 200)}
                    {item.reply.length > 200 ? "..." : ""}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
