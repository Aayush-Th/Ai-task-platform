const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`rounded-3xl border border-white/10 bg-slate-900/80 shadow-2xl shadow-slate-950/40 backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
