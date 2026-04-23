const Input = ({
  label,
  icon: Icon,
  as = "input",
  className = "",
  options = [],
  ...props
}) => {
  const Element = as;

  return (
    <label className={`group relative block ${className}`}>
      <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span>
      <div className="relative">
        {Icon ? (
          <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400" />
        ) : null}
        {as === "select" ? (
          <select
            className={`w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-500/10 ${Icon ? "pl-11" : ""}`}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <Element
            className={`w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-500/10 ${Icon ? "pl-11" : ""} ${as === "textarea" ? "min-h-32 resize-y" : ""}`}
            {...props}
          />
        )}
      </div>
    </label>
  );
};

export default Input;
