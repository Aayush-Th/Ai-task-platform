import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";
import Card from "./ui/Card";

const COLORS = ["#22d3ee", "#34d399", "#f59e0b", "#f43f5e", "#818cf8"];

const AnalyticsPanel = ({ stats }) => {
  const success = stats.status.find((item) => item._id === "success")?.count || 0;
  const failed = stats.status.find((item) => item._id === "failed")?.count || 0;
  const statusRatio = [
    { name: "Success", value: success },
    { name: "Failed", value: failed }
  ];

  const operationData = stats.operation.map((item) => ({
    name: item._id,
    value: item.count
  }));

  const dailyData = stats.daily.map((item) => ({
    day: item._id.slice(5),
    count: item.count
  }));

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="h-full p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-200">Tasks Created (14 days)</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Bar dataKey="count" fill="#22d3ee" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card className="h-full p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-200">Success vs Failed</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusRatio} dataKey="value" cx="50%" cy="50%" outerRadius={70} label>
                  {statusRatio.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="h-full p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-200">Operation Usage</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={operationData} dataKey="value" cx="50%" cy="50%" outerRadius={70} label>
                  {operationData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default AnalyticsPanel;
