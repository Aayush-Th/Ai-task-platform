import { Loader2 } from "lucide-react";

const Loader = ({ label = "Loading..." }) => {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-300">
      <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
      <span>{label}</span>
    </div>
  );
};

export default Loader;
