import { LogOut, Menu, Moon, RefreshCw, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useTheme from "../../hooks/useTheme";
import Button from "../ui/Button";

const Topbar = ({ onMenuClick, onRefresh, refreshing = false }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Workspace</p>
            <h1 className="text-lg font-semibold text-white">Task Operations Dashboard</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={toggleTheme}
            icon={theme === "dark" ? Sun : Moon}
          >
            {theme === "dark" ? "Light" : "Dark"}
          </Button>
          {onRefresh ? (
            <Button variant="secondary" size="sm" onClick={onRefresh} loading={refreshing} icon={RefreshCw}>
              Refresh
            </Button>
          ) : null}
          <div className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-right sm:block">
            <p className="text-sm font-medium text-white">{user?.name || "User"}</p>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>
          <Button variant="danger" size="sm" onClick={handleLogout} icon={LogOut}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
