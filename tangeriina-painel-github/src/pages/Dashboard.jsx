import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../components/Header";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    leads: 48,
    iaActive: true,
    conversions: 12
  });

  useEffect(() => {
    // Aqui você pode fazer uma chamada à API para buscar os dados reais
    // const fetchStats = async () => { ... };
  }, []);

  function handleLogout() {
    localStorage.removeItem("auth");
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onLogout={handleLogout} />
      
      <main className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-orange-600 mb-2">
            Tangeriina IA — Painel Inteligente
          </h1>
          <p className="text-gray-600">Bem-vindo ao seu painel de controle</p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Leads</p>
                <p className="text-3xl font-bold text-orange-600">{stats.leads}</p>
              </div>
              <div className="text-4xl text-orange-200">📊</div>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Status da IA</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.iaActive ? "Ativa" : "Inativa"}
                </p>
              </div>
              <div className="text-4xl">{stats.iaActive ? "✅" : "❌"}</div>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Conversões</p>
                <p className="text-3xl font-bold text-blue-600">{stats.conversions}</p>
              </div>
              <div className="text-4xl">🎯</div>
            </div>
          </div>
        </div>

        {/* Seção de Ações */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/ia"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition text-center"
            >
              🤖 Abrir IA Studio
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              🚪 Sair
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
