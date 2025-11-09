import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import IAStudio from "./pages/IAStudio";

// Componente para proteger rotas autenticadas
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("auth");
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("auth");

  useEffect(() => {
    // Simular verificação de autenticação
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota de Login */}
        <Route 
          path="/login" 
          element={token ? <Navigate to="/" replace /> : <Login />} 
        />

        {/* Rota protegida: Dashboard */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* Rota protegida: IA Studio */}
        <Route 
          path="/ia" 
          element={
            <ProtectedRoute>
              <IAStudio />
            </ProtectedRoute>
          } 
        />

        {/* Rota 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
