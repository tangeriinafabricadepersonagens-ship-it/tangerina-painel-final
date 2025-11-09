// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [leads, setLeads] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    fetchLeads();
    const interval = setInterval(fetchLeads, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await api.get("/api/leads");
      setLeads(response.data);
      setDataLoaded(true);
    } catch (error) {
      console.error("Erro ao buscar leads:", error);
    }
  };

  const leadsArray = Object.values(leads);

  // Dados do gráfico de pizza (status)
  const statusData = ["Frio", "Morno", "Quente"].map((status) => ({
    name: status,
    value: leadsArray.filter((lead) => lead.status === status).length,
  }));

  // Dados do gráfico de linha (novos leads por dia)
  const dailyData = leadsArray.reduce((acc, lead) => {
    const day = new Date(lead.atualizado).toLocaleDateString("pt-BR");
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});
  const chartData = Object.entries(dailyData).map(([day, count]) => ({
    name: day,
    leads: count,
  }));

  const COLORS = ["#3B82F6", "#F59E0B", "#EF4444"];

  if (!dataLoaded) {
    return (
      <div className="flex justify-center items-center h-full text-gray-500 animate-pulse">
        Carregando dados...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* CARD - Gráfico de Pizza */}
      <motion.div
        className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Leads por Status
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      {/* CARD - Gráfico de Linha */}
      <motion.div
        className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Novos Leads por Dia
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="leads"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default Dashboard;
