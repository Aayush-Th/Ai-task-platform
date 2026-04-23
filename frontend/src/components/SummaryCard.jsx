import Card from "./ui/Card";

const SummaryCard = ({ label, value, icon: Icon, colorClass }) => {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
        </div>
        <div className={`rounded-2xl p-3 ${colorClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
};

export default SummaryCard;
