export default function Sidebar({ page, setPage }) {
  const menu = [
    { id: "dashboard", label: "📊 Dashboard" },
    { id: "leads", label: "💬 Leads" },
    { id: "config", label: "⚙️ Configurações" },
  ];

  return (
    <div className="w-64 bg-orange-600 text-white flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-6">Tangerina IA 🍊</h1>

      {menu.map((item) => (
        <button
          key={item.id}
          onClick={() => setPage(item.id)}
          className={`text-left px-3 py-2 rounded-md mb-2 transition ${
            page === item.id ? "bg-orange-400" : "hover:bg-orange-500"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
