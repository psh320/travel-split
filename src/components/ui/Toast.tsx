import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { ToastContext, type ToastType } from "./toastContext";

type ToastItem = {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "success", duration = 3200) => {
      const id = Date.now() + Math.random();
      setToasts((current) => [
        ...current.slice(-2),
        { id, message, type, duration },
      ]);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-region" aria-live="polite" aria-atomic="false">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            onDismiss={() => dismissToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function Toast({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timeoutId = window.setTimeout(onDismiss, toast.duration);
    return () => window.clearTimeout(timeoutId);
  }, [onDismiss, toast.duration]);

  return (
    <div className={`toast toast-${toast.type}`} role={toast.type === "error" ? "alert" : "status"}>
      <span className="toast-mark" aria-hidden="true">
        {toast.type === "success" ? "✓" : toast.type === "error" ? "!" : "i"}
      </span>
      <span className="toast-message">{toast.message}</span>
      <button
        type="button"
        className="toast-dismiss"
        onClick={onDismiss}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
}
