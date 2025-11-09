import { useEffect, useState } from "react";
import api from "../services/api";

export default function Header() {
  const [status, setStatus] = useState("Carregando...");
  const [leadsCount, setLeadsCount] = useState(0);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get("/api/status");
        setStatus(res.data.status === "online" ? "🟢 Online" : "🔴 Offline");
        setLeadsCount(res.data.leadsCount);
      } catch (err) {
        setStatus("🔴 Offline");
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h2 className="text-xl font-semibold">Painel Tangerina IA 🍊</h2>
      <div className="flex items-center gap-4">
        <span>{status}</span>
        <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
          Leads: {leadsCount}
        </span>
      </div>
    </header>
  );
}
