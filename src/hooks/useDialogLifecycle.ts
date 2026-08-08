import { useEffect, useRef } from "react";

interface DialogLifecycleOptions {
  lockBodyScroll?: boolean;
}

export const useDialogLifecycle = (
  isOpen: boolean,
  onDismiss: () => void,
  { lockBodyScroll = true }: DialogLifecycleOptions = {}
) => {
  const onDismissRef = useRef(onDismiss);

  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDismissRef.current();
    };
    const previousOverflow = document.body.style.overflow;

    if (lockBodyScroll) document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      if (lockBodyScroll) document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, lockBodyScroll]);
};
