import {
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { ToastContext, type ToastType } from "./toastContext";
import { t } from "../../i18n";

type ToastItem = {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: number) => {
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
            onDismiss={removeToast}
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
  onDismiss: (id: number) => void;
}) {
  const [isLeaving, setIsLeaving] = useState(false);

  const beginDismiss = useCallback(() => {
    if (isLeaving) return;
    setIsLeaving(true);
    window.setTimeout(() => onDismiss(toast.id), 180);
  }, [isLeaving, onDismiss, toast.id]);

  useEffect(() => {
    const timeoutId = window.setTimeout(beginDismiss, toast.duration);
    return () => window.clearTimeout(timeoutId);
  }, [beginDismiss, toast.duration]);

  const toastStyle = {
    "--toast-duration": `${toast.duration}ms`,
  } as CSSProperties;

  return (
    <div
      className={`toast toast-${toast.type}${isLeaving ? " is-leaving" : ""}`}
      role={toast.type === "error" ? "alert" : "status"}
      style={toastStyle}
    >
      <span className="toast-mark" aria-hidden="true">
        {toast.type === "success" ? "✓" : toast.type === "error" ? "!" : "i"}
      </span>
      <span className="toast-message">{toast.message}</span>
      <button
        type="button"
        className="toast-dismiss"
        onClick={beginDismiss}
        aria-label={t("dismissNotification")}
      >
        ×
      </button>
      <span className="toast-timer" aria-hidden="true" />
    </div>
  );
}
