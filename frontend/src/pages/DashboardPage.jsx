import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Clock3, LoaderCircle, Plus, Sparkles } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import ActivityFeed from "../components/ActivityFeed";
import AnalyticsPanel from "../components/AnalyticsPanel";
import AppShell from "../components/layout/AppShell";
import SummaryCard from "../components/SummaryCard";
import TaskFilters from "../components/TaskFilters";
import TaskForm from "../components/TaskForm";
import TaskTable from "../components/TaskTable";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Modal from "../components/ui/Modal";
import { useToast } from "../components/ui/ToastContext";
import useTasks from "../hooks/useTasks";

const DashboardPage = () => {
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [runningTaskId, setRunningTaskId] = useState("");
  const [retryTaskId, setRetryTaskId] = useState("");
  const [deletingTaskId, setDeletingTaskId] = useState("");
  const [taskToDelete, setTaskToDelete] = useState(null);
  const {
    tasks,
    loading,
    refreshing,
    filters,
    setFilters,
    pagination,
    stats: analyticsStats,
    activity,
    fetchTasks,
    fetchDashboardMeta
  } = useTasks({ showToast });

  useEffect(() => {
    const interval = window.setInterval(() => {
      fetchTasks({ silent: true });
      fetchDashboardMeta();
    }, 5000);

    return () => window.clearInterval(interval);
  }, [fetchTasks, fetchDashboardMeta]);

  const handleCreateTask = async (payload) => {
    setLoadingCreate(true);
    try {
      await axiosClient.post("/tasks", payload);
      await fetchTasks();
      await fetchDashboardMeta();
      showToast({ title: "Task created", message: "Your task is ready to be queued." });
      return true;
    } catch (err) {
      showToast({
        title: "Task creation failed",
        message: err.response?.data?.message || "Please review the form and try again.",
        type: "error"
      });
      return false;
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleRunTask = async (taskId) => {
    setRunningTaskId(taskId);
    try {
      await axiosClient.post(`/tasks/${taskId}/run`);
      await fetchTasks({ silent: true });
      await fetchDashboardMeta();
      showToast({ title: "Task queued", message: "The worker will start processing shortly." });
    } catch (err) {
      showToast({
        title: "Queue failed",
        message: err.response?.data?.message || "Could not queue the task.",
        type: "error"
      });
    } finally {
      setRunningTaskId("");
    }
  };

  const handleRetryTask = useCallback(
    async (taskId) => {
      setRetryTaskId(taskId);
      try {
        await axiosClient.post(`/tasks/${taskId}/retry`);
        await fetchTasks({ silent: true });
        await fetchDashboardMeta();
        showToast({ title: "Retry started", message: "Failed task has been re-queued." });
      } catch (error) {
        showToast({
          title: "Retry failed",
          message: error.response?.data?.message || "Could not retry task.",
          type: "error"
        });
      } finally {
        setRetryTaskId("");
      }
    },
    [fetchDashboardMeta, fetchTasks, showToast]
  );

  const confirmDelete = async () => {
    if (!taskToDelete) return;
    setDeletingTaskId(taskToDelete._id);
    try {
      await axiosClient.delete(`/tasks/${taskToDelete._id}`);
      setTaskToDelete(null);
      await fetchTasks({ silent: true });
      await fetchDashboardMeta();
      showToast({ title: "Task deleted", message: "Task removed from your workspace." });
    } catch (error) {
      showToast({
        title: "Delete failed",
        message: error.response?.data?.message || "Could not delete task.",
        type: "error"
      });
    } finally {
      setDeletingTaskId("");
    }
  };

  const stats = useMemo(
    () => ({
      total: pagination.total,
      running:
        (analyticsStats.status.find((item) => item._id === "running")?.count || 0) +
        (analyticsStats.status.find((item) => item._id === "pending")?.count || 0),
      completed: analyticsStats.status.find((item) => item._id === "success")?.count || 0,
      failed: analyticsStats.status.find((item) => item._id === "failed")?.count || 0
    }),
    [analyticsStats.status, pagination.total]
  );

  const section = searchParams.get("section");

  return (
    <AppShell
      onRefresh={() => {
        fetchTasks({ silent: true });
        fetchDashboardMeta();
      }}
      refreshing={refreshing}
    >
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="overflow-hidden bg-gradient-to-r from-cyan-500/10 via-slate-900/90 to-violet-500/10 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Modern SaaS Dashboard
              </div>
              <h2 className="text-3xl font-semibold text-white">Manage async task processing with confidence</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                Create tasks, queue operations, and monitor results in real time from a polished command center.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-4">
              <Sparkles className="h-10 w-10 text-cyan-300" />
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button icon={Plus} onClick={() => setFilters((prev) => ({ ...prev, page: 1 }))}>
              Create Task
            </Button>
            <Button variant="secondary" onClick={() => fetchTasks({ silent: true })}>
              Refresh Tasks
            </Button>
          </div>
          </Card>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Total Tasks" value={stats.total} icon={Clock3} colorClass="bg-white/5 text-slate-200" />
          <SummaryCard label="Running Tasks" value={stats.running} icon={LoaderCircle} colorClass="bg-sky-500/15 text-sky-300" />
          <SummaryCard label="Completed Tasks" value={stats.completed} icon={CheckCircle2} colorClass="bg-emerald-500/15 text-emerald-300" />
          <SummaryCard label="Failed Tasks" value={stats.failed} icon={AlertTriangle} colorClass="bg-rose-500/15 text-rose-300" />
        </div>

        <AnalyticsPanel stats={analyticsStats} />

        <TaskFilters
          filters={filters}
          onChange={(next) => setFilters((prev) => ({ ...prev, ...next }))}
          onReset={() =>
            setFilters({
              q: "",
              status: "all",
              operation: "all",
              sortBy: "createdAt",
              sortOrder: "desc",
              page: 1,
              limit: 10
            })
          }
        />

        <div className="grid gap-6 xl:grid-cols-[1.1fr,1.4fr]">
          {(section === "create" || !section) && (
            <TaskForm onCreateTask={handleCreateTask} loading={loadingCreate} />
          )}
          {(section === "tasks" || !section || section === "create") && (
            <TaskTable
              tasks={tasks}
              onRun={handleRunTask}
              onRetry={handleRetryTask}
              onDelete={setTaskToDelete}
              runningTaskId={runningTaskId}
              retryTaskId={retryTaskId}
              deletingTaskId={deletingTaskId}
              loading={loading}
              pagination={pagination}
              onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
            />
          )}
        </div>

        <ActivityFeed items={activity} />
      </div>

      <Modal open={Boolean(taskToDelete)} title="Delete task?" onClose={() => setTaskToDelete(null)}>
        <p className="text-sm text-slate-300">
          This action permanently removes <span className="font-semibold text-white">{taskToDelete?.title}</span>.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setTaskToDelete(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete} loading={Boolean(deletingTaskId)}>
            Delete task
          </Button>
        </div>
      </Modal>
    </AppShell>
  );
};

export default DashboardPage;
