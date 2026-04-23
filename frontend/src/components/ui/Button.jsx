import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 hover:bg-cyan-400",
  secondary:
    "bg-white/10 text-slate-100 hover:bg-white/15 border border-white/10",
  danger: "bg-rose-500 text-white hover:bg-rose-400 shadow-lg shadow-rose-500/20",
  ghost: "bg-transparent text-slate-300 hover:bg-white/5"
};

const sizes = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-sm"
};

const Button = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  ...props
}) => {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : Icon ? <Icon className="h-4 w-4" /> : null}
      {children}
    </button>
  );
};

export default Button;
