import { Link } from "react-router-dom";

export default function Header({ onLogout }) {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-orange-600">🍊</span>
          <span className="text-xl font-bold text-gray-800">Tangeriina IA</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className="text-gray-600 hover:text-orange-600 font-medium transition"
          >
            Dashboard
          </Link>
          <Link
            to="/ia"
            className="text-gray-600 hover:text-orange-600 font-medium transition"
          >
            IA Studio
          </Link>
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Sair
          </button>
        </nav>
      </div>
    </header>
  );
}
