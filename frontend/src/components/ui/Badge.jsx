const styles = {
  pending: "bg-amber-500/15 text-amber-300 ring-amber-400/20",
  running: "bg-sky-500/15 text-sky-300 ring-sky-400/20",
  success: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/20",
  failed: "bg-rose-500/15 text-rose-300 ring-rose-400/20"
};

const Badge = ({ children, status }) => {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ${styles[status] || "bg-white/10 text-slate-200 ring-white/10"}`}
    >
      {children}
    </span>
  );
};

export default Badge;
