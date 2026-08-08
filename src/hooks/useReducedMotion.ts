import { useEffect, useState } from "react";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia(reducedMotionQuery).matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(reducedMotionQuery);
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
};
