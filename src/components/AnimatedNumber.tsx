import React, { useEffect, useRef, useState } from 'react';

interface AnimatedNumberProps {
  value: number;
  className?: string;
  decimals?: number;
  suffix?: React.ReactNode;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  className = '',
  decimals = 0,
  suffix,
}) => {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) return;

    const duration = 650;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = from + (to - from) * eased;
      setDisplay(current);
      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
        setDisplay(to);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [value]);

  const formatted =
    decimals > 0
      ? display.toFixed(decimals)
      : Math.round(display).toLocaleString();

  return (
    <span className={`tz-metric ${className}`.trim()} key={value}>
      {formatted}
      {suffix}
    </span>
  );
};
