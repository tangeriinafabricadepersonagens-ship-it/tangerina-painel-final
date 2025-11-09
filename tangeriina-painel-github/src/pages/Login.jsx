import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      if (!user.trim() || !pass.trim()) {
        setMsg("Usuário e senha são obrigatórios");
        setLoading(false);
        return;
      }

      const { data } = await axios.post("/api/login", { user, pass });
      
      if (data.token) {
        localStorage.setItem("auth", data.token);
        window.location.href = "/";
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setMsg("Usuário ou senha inválidos");
      } else {
        setMsg("Erro ao conectar ao servidor. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-orange-600 mb-8">
          Tangeriina IA
        </h1>
        <p className="text-center text-gray-600 mb-6">Painel Inteligente</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usuário
            </label>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="Digite seu usuário"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Digite sua senha"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold p-3 rounded-lg transition duration-200"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {msg && (
          <p className="text-red-500 text-sm mt-4 text-center bg-red-50 p-3 rounded-lg">
            {msg}
          </p>
        )}

        <p className="text-center text-gray-500 text-xs mt-6">
          Credenciais padrão: tangeriina / galera9$
        </p>
      </div>
    </div>
  );
}
