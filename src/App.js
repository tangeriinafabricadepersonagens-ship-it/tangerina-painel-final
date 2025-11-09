import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Config from "./pages/Config";

function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Menu lateral */}
      <Sidebar page={page} setPage={setPage} />

      {/* Área principal */}
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-6 overflow-y-auto">
          {page === "dashboard" && <Dashboard />}
          {page === "leads" && <Leads />}
          {page === "config" && <Config />}
        </main>
      </div>
    </div>
  );
}

export default App;
