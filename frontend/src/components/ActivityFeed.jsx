import { Activity } from "lucide-react";
import Card from "./ui/Card";

const ActivityFeed = ({ items }) => {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center gap-2">
        <Activity className="h-4 w-4 text-cyan-300" />
        <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
      </div>
      <div className="space-y-3">
        {items.length ? (
          items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3">
              <p className="text-sm text-slate-200">{item.message}</p>
              <p className="mt-1 text-xs text-slate-500">{new Date(item.updatedAt).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400">No recent task events yet.</p>
        )}
      </div>
    </Card>
  );
};

export default ActivityFeed;
