import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/dashboard" className="text-lg font-semibold text-cyan-400">
          AI Task Platform
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-300">{user?.name || "User"}</span>
          <button
            onClick={handleLogout}
            className="rounded bg-rose-600 px-3 py-1.5 text-sm font-medium hover:bg-rose-500"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
