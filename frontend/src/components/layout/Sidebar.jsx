import { BrainCircuit, LayoutDashboard, ListChecks, PlusSquare, UserCircle2, X } from "lucide-react";
import { Link, useLocation, useSearchParams } from "react-router-dom";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Create Task", href: "/dashboard?section=create", icon: PlusSquare },
  { label: "Tasks", href: "/dashboard?section=tasks", icon: ListChecks },
  { label: "Profile", href: "/profile", icon: UserCircle2 }
];

const Sidebar = ({ open, onClose }) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm transition md:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-white/10 bg-slate-950/90 px-5 py-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl transition-transform md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="mb-10 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-white">AI Task Platform</p>
              <p className="text-xs text-slate-400">Processing workspace</p>
            </div>
          </Link>
          <button className="md:hidden" onClick={onClose}>
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        <nav className="space-y-2">
          {navItems.map(({ label, href, icon: Icon }) => {
            const hrefSection = href.includes("?section=") ? href.split("?section=")[1] : null;
            const currentSection = searchParams.get("section");
            const active =
              location.pathname === "/dashboard"
                ? hrefSection
                  ? currentSection === hrefSection
                  : !currentSection
                : location.pathname === href;

            return (
              <Link
                key={label}
                to={href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-cyan-500/15 text-cyan-300 shadow-lg shadow-cyan-950/20"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
