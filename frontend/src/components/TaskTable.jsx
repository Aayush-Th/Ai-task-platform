import { Eye, Play, RotateCcw, Trash2 } from "lucide-react";
import { memo } from "react";
import { Link } from "react-router-dom";
import Badge from "./ui/Badge";
import Button from "./ui/Button";
import Card from "./ui/Card";
import Skeleton from "./ui/Skeleton";

const TaskTable = ({
  tasks,
  onRun,
  onRetry,
  onDelete,
  runningTaskId,
  retryTaskId,
  deletingTaskId,
  loading,
  pagination,
  onPageChange
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold text-white">Tasks</h2>
          <p className="text-sm text-slate-400">Track statuses, rerun jobs, and inspect outputs.</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/[0.03] text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Operation</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Updated</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 4 }).map((_, index) => (
                <tr key={index} className="border-t border-white/5">
                  <td className="px-6 py-4">
                    <Skeleton className="h-5 w-40" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-5 w-24" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-7 w-20" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-5 w-28" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Skeleton className="h-9 w-20" />
                      <Skeleton className="h-9 w-20" />
                    </div>
                  </td>
                </tr>
              ))}
            {tasks.map((task) => (
              <tr key={task._id} className="border-t border-white/5 transition hover:bg-white/[0.03]">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-white">{task.title}</p>
                    <p className="text-xs text-slate-500">{task._id.slice(-8)}</p>
                  </div>
                </td>
                <td className="px-6 py-4 capitalize text-slate-300">{task.operation}</td>
                <td className="px-6 py-4">
                  <Badge status={task.status}>{task.status}</Badge>
                </td>
                <td className="px-6 py-4 text-slate-400">{new Date(task.updatedAt).toLocaleString()}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => onRun(task._id)}
                      variant="secondary"
                      size="sm"
                      icon={Play}
                      loading={runningTaskId === task._id}
                    >
                      {runningTaskId === task._id ? "Queued..." : "Run"}
                    </Button>
                    <Button
                      onClick={() => onRetry(task._id)}
                      variant="secondary"
                      size="sm"
                      icon={RotateCcw}
                      loading={retryTaskId === task._id}
                      disabled={task.status !== "failed"}
                    >
                      Retry
                    </Button>
                    <Button
                      onClick={() => onDelete(task)}
                      variant="danger"
                      size="sm"
                      icon={Trash2}
                      loading={deletingTaskId === task._id}
                    >
                      Delete
                    </Button>
                    <Link
                      to={`/tasks/${task._id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && !tasks.length && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  No tasks match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-white/10 px-6 py-4 text-sm text-slate-400">
        <p>
          Showing page {pagination.page} of {Math.max(1, pagination.totalPages)}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => onPageChange(pagination.page - 1)}
          >
            Previous
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => onPageChange(pagination.page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default memo(TaskTable);
