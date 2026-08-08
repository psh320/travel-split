import { useEffect, useRef, useState } from "react";
import { formatAmount, formatCompactAmount } from "../utils";
import { useReducedMotion } from "../hooks/useReducedMotion";

type AnimatedAmountProps = {
  amount: number;
  compact?: boolean;
  duration?: number;
  className?: string;
};

export function AnimatedAmount({
  amount,
  compact = false,
  duration = 650,
  className = "",
}: AnimatedAmountProps) {
  const prefersReducedMotion = useReducedMotion();
  const displayValueRef = useRef(prefersReducedMotion ? amount : 0);
  const [displayValue, setDisplayValue] = useState(displayValueRef.current);

  useEffect(() => {
    if (prefersReducedMotion) {
      displayValueRef.current = amount;
      setDisplayValue(amount);
      return;
    }

    const startValue = displayValueRef.current;
    const difference = amount - startValue;
    const startedAt = performance.now();
    let animationFrame = 0;

    const updateValue = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const nextValue = startValue + difference * easedProgress;

      displayValueRef.current = nextValue;
      setDisplayValue(nextValue);

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(updateValue);
      } else {
        displayValueRef.current = amount;
        setDisplayValue(amount);
      }
    };

    animationFrame = window.requestAnimationFrame(updateValue);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [amount, duration, prefersReducedMotion]);

  const formatter = compact ? formatCompactAmount : formatAmount;

  return (
    <span
      className={`animated-amount ${className}`.trim()}
      aria-label={formatter(amount)}
    >
      <span aria-hidden="true">{formatter(displayValue)}</span>
    </span>
  );
}
