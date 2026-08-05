import { createContext } from "react";

export type ToastType = "success" | "error" | "info";

export type ToastContextValue = {
  showToast: (
    message: string,
    type?: ToastType,
    duration?: number
  ) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);
