import Card from "./ui/Card";

const AuthShell = ({ title, subtitle, children, footer }) => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(6,182,212,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.16),_transparent_30%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,rgba(15,23,42,0.6),rgba(2,6,23,0.95))]" />
      <Card className="relative z-10 w-full max-w-md p-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">AI Task Platform</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">{title}</h1>
          <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
        </div>
        {children}
        {footer ? <div className="mt-6 text-sm text-slate-400">{footer}</div> : null}
      </Card>
    </div>
  );
};

export default AuthShell;
