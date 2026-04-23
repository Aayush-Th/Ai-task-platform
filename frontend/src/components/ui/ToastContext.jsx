import { createContext, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const showToast = ({ title, message, type = "success" }) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, title, message, type }]);
    window.setTimeout(() => removeToast(id), 3500);
  };

  const value = useMemo(() => ({ showToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[60] flex w-full max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur ${
              toast.type === "error"
                ? "border-rose-400/20 bg-rose-500/10 text-rose-100"
                : "border-emerald-400/20 bg-emerald-500/10 text-emerald-100"
            }`}
          >
            <p className="font-semibold">{toast.title}</p>
            {toast.message ? <p className="mt-1 text-sm opacity-90">{toast.message}</p> : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
};
