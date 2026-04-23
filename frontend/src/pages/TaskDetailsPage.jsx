import { Activity, ArrowLeft, Braces, Copy, Download, FileText, ScrollText } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import AppShell from "../components/layout/AppShell";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Skeleton from "../components/ui/Skeleton";
import { useToast } from "../components/ui/ToastContext";

const TaskDetailsPage = () => {
  const { id } = useParams();
  const { showToast } = useToast();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTask = useCallback(async () => {
    try {
      const response = await axiosClient.get(`/tasks/${id}`);
      setTask(response.data);
    } catch (err) {
      showToast({
        title: "Failed to load task",
        message: err.response?.data?.message || "Please try again.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  useEffect(() => {
    if (!task || !["pending", "running"].includes(task.status)) return undefined;
    const interval = window.setInterval(() => {
      fetchTask();
    }, 4000);
    return () => window.clearInterval(interval);
  }, [task?.status, fetchTask]);

  const copyResult = async () => {
    if (!task?.result) return;
    await navigator.clipboard.writeText(task.result);
    showToast({ title: "Copied", message: "Result copied to clipboard." });
  };

  const exportTask = () => {
    if (!task) return;
    const blob = new Blob([JSON.stringify(task, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${task.title.replace(/\s+/g, "-").toLowerCase()}-task.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell onRefresh={fetchTask}>
      <div className="mx-auto max-w-6xl space-y-6">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-cyan-300 transition hover:text-cyan-200">
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        {loading ? (
          <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        ) : task ? (
          <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
            <Card className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-400">Task Details</p>
                  <h1 className="mt-2 text-3xl font-semibold text-white">{task.title}</h1>
                </div>
                <Badge status={task.status}>{task.status}</Badge>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" icon={Copy} onClick={copyResult}>
                  Copy Result
                </Button>
                <Button variant="secondary" size="sm" icon={Download} onClick={exportTask}>
                  Export JSON
                </Button>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
                    <Braces className="h-4 w-4" />
                    Operation
                  </div>
                  <p className="text-lg font-medium capitalize text-white">{task.operation}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
                    <Activity className="h-4 w-4" />
                    Last updated
                  </div>
                  <p className="text-lg font-medium text-white">{new Date(task.updatedAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                <section>
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-300">
                    <FileText className="h-4 w-4" />
                    Input text
                  </div>
                  <pre className="whitespace-pre-wrap rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-sm text-slate-300">
                    {task.inputText}
                  </pre>
                </section>

                <section>
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-300">
                    <SparklesIcon />
                    Result
                  </div>
                  <pre className="whitespace-pre-wrap rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-100 shadow-inner shadow-emerald-950/20">
                    {task.result || "No result yet"}
                  </pre>
                </section>
              </div>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-300">
                <ScrollText className="h-4 w-4" />
                Processing logs
                {["pending", "running"].includes(task.status) ? (
                  <span className="ml-2 inline-flex items-center gap-1 text-xs text-cyan-300">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
                    Live
                  </span>
                ) : null}
              </div>
              <div className="max-h-[540px] overflow-auto rounded-2xl border border-white/10 bg-slate-950/80 p-4">
                <pre className="whitespace-pre-wrap text-sm leading-6 text-slate-300">
                  {task.logs?.length ? task.logs.join("\n") : "No logs yet"}
                </pre>
              </div>
            </Card>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
};

const SparklesIcon = () => <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,0.8)]" />;

export default TaskDetailsPage;
