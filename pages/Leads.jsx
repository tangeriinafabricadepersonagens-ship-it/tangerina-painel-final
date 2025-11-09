import { useEffect, useState } from "react";
import api from "../services/api";

export default function Leads() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const fetchLeads = async () => {
      const res = await api.get("/api/leads");
      const formatted = Object.entries(res.data).map(([id, data]) => ({
        id,
        ...data,
      }));
      setLeads(formatted);
    };
    fetchLeads();
    const interval = setInterval(fetchLeads, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Leads Recebidos</h3>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2 px-3">Telefone</th>
            <th className="py-2 px-3">Perfil</th>
            <th className="py-2 px-3">Interesse</th>
            <th className="py-2 px-3">Status</th>
            <th className="py-2 px-3">Atualizado</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-3">{lead.id}</td>
              <td className="py-2 px-3">{lead.perfil}</td>
              <td className="py-2 px-3">{lead.interesse}</td>
              <td className="py-2 px-3 font-semibold text-orange-600">
                {lead.status}
              </td>
              <td className="py-2 px-3 text-sm text-gray-500">
                {lead.atualizado
                  ? new Date(lead.atualizado).toLocaleTimeString()
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
