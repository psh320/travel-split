import { useEffect } from "react";

const KEYBOARD_OPEN_THRESHOLD = 96;

const isTextEntryControl = (
  element: Element | null
): element is HTMLElement =>
  element instanceof HTMLInputElement ||
  element instanceof HTMLTextAreaElement ||
  (element instanceof HTMLElement && element.isContentEditable);

export const getKeyboardInset = ({
  baselineHeight,
  hasFocusedInput,
  offsetTop,
  visualHeight,
}: {
  baselineHeight: number;
  hasFocusedInput: boolean;
  offsetTop: number;
  visualHeight: number;
}) => {
  if (!hasFocusedInput) return 0;

  const inset = Math.max(0, baselineHeight - visualHeight - offsetTop);
  return inset >= KEYBOARD_OPEN_THRESHOLD ? inset : 0;
};

export const useVisualViewport = () => {
  useEffect(() => {
    const root = document.documentElement;
    const viewport = window.visualViewport;
    let baselineHeight = Math.max(window.innerHeight, viewport?.height ?? 0);
    let focusTimer = 0;
    let blurTimer = 0;

    const ensureFocusedControlIsVisible = () => {
      window.clearTimeout(focusTimer);
      focusTimer = window.setTimeout(() => {
        const activeElement = document.activeElement;
        if (!isTextEntryControl(activeElement)) return;

        const currentViewport = window.visualViewport;
        const offsetTop = currentViewport?.offsetTop ?? 0;
        const viewportHeight = currentViewport?.height ?? window.innerHeight;
        const safeTop = offsetTop + 16;
        const safeBottom = offsetTop + viewportHeight - 16;
        const rect = activeElement.getBoundingClientRect();

        if (rect.top < safeTop || rect.bottom > safeBottom) {
          activeElement.scrollIntoView({
            block: "center",
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
              .matches
              ? "auto"
              : "smooth",
          });
        }
      }, 120);
    };

    const syncViewport = () => {
      const currentViewport = window.visualViewport;
      const visualHeight = currentViewport?.height ?? window.innerHeight;
      const offsetTop = currentViewport?.offsetTop ?? 0;
      const hasFocusedInput = isTextEntryControl(document.activeElement);

      if (
        !hasFocusedInput &&
        visualHeight >= baselineHeight - KEYBOARD_OPEN_THRESHOLD
      ) {
        baselineHeight = Math.max(window.innerHeight, visualHeight);
      }

      const keyboardInset = getKeyboardInset({
        baselineHeight,
        hasFocusedInput,
        offsetTop,
        visualHeight,
      });

      root.style.setProperty(
        "--visual-viewport-height",
        `${Math.round(visualHeight)}px`
      );
      root.style.setProperty(
        "--visual-viewport-offset-top",
        `${Math.round(offsetTop)}px`
      );
      root.style.setProperty(
        "--keyboard-inset",
        `${Math.round(keyboardInset)}px`
      );
      root.toggleAttribute("data-keyboard-open", keyboardInset > 0);

      if (keyboardInset > 0) ensureFocusedControlIsVisible();
    };

    const handleFocusIn = () => {
      window.clearTimeout(blurTimer);
      syncViewport();
      ensureFocusedControlIsVisible();
    };

    const handleFocusOut = () => {
      window.clearTimeout(blurTimer);
      blurTimer = window.setTimeout(syncViewport, 220);
    };

    const handleOrientationChange = () => {
      baselineHeight = Math.max(
        window.innerHeight,
        window.visualViewport?.height ?? 0
      );
      syncViewport();
    };

    syncViewport();
    window.addEventListener("resize", syncViewport);
    window.addEventListener("orientationchange", handleOrientationChange);
    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);
    viewport?.addEventListener("resize", syncViewport);
    viewport?.addEventListener("scroll", syncViewport);

    return () => {
      window.clearTimeout(focusTimer);
      window.clearTimeout(blurTimer);
      window.removeEventListener("resize", syncViewport);
      window.removeEventListener("orientationchange", handleOrientationChange);
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
      viewport?.removeEventListener("resize", syncViewport);
      viewport?.removeEventListener("scroll", syncViewport);
      root.style.removeProperty("--visual-viewport-height");
      root.style.removeProperty("--visual-viewport-offset-top");
      root.style.removeProperty("--keyboard-inset");
      root.removeAttribute("data-keyboard-open");
    };
  }, []);
};
