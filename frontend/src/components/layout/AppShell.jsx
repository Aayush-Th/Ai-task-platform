import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const AppShell = ({ children, onRefresh, refreshing = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="md:pl-72">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
};

export default AppShell;
