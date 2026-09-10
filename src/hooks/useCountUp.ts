"use client";

import { useEffect, useState } from "react";

export function useCountUp(
  targetNumber: number,
  durationMs: number = 1400,
  startNow: boolean = true,
  decimals: number = 0
): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startNow || targetNumber <= 0) {
      setCount(targetNumber);
      return;
    }

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / durationMs, 1);

      // Smooth ease-out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = easeOut * targetNumber;

      if (decimals > 0) {
        setCount(parseFloat(current.toFixed(decimals)));
      } else {
        setCount(Math.floor(current));
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(targetNumber);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetNumber, durationMs, startNow, decimals]);

  return count;
}
