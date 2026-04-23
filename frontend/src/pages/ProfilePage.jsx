import { Download, UserRound } from "lucide-react";
import { useMemo } from "react";
import AppShell from "../components/layout/AppShell";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import useTasks from "../hooks/useTasks";
import { useToast } from "../components/ui/ToastContext";

const ProfilePage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { stats } = useTasks({ showToast });

  const apiUsage = useMemo(
    () => stats.status.reduce((total, item) => total + item.count, 0),
    [stats.status]
  );

  const exportStats = () => {
    const blob = new Blob([JSON.stringify(stats, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "task-stats.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-cyan-500/15 p-3 text-cyan-300">
                <UserRound className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white">{user?.name || "User Profile"}</h2>
                <p className="text-sm text-slate-400">{user?.email}</p>
              </div>
            </div>
            <Button variant="secondary" icon={Download} onClick={exportStats}>
              Export JSON
            </Button>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-5">
            <p className="text-sm text-slate-400">API Usage (tasks)</p>
            <p className="mt-2 text-3xl font-semibold text-white">{apiUsage}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-slate-400">Successful Jobs</p>
            <p className="mt-2 text-3xl font-semibold text-emerald-300">
              {stats.status.find((item) => item._id === "success")?.count || 0}
            </p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-slate-400">Failed Jobs</p>
            <p className="mt-2 text-3xl font-semibold text-rose-300">
              {stats.status.find((item) => item._id === "failed")?.count || 0}
            </p>
          </Card>
        </div>
      </div>
    </AppShell>
  );
};

export default ProfilePage;
