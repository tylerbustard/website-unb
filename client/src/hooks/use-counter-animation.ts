import { useState, useEffect, useRef } from 'react';

interface UseCounterAnimationProps {
  end: number;
  start?: number;
  duration?: number;
  delay?: number;
}

export function useCounterAnimation({ 
  end, 
  start = 0, 
  duration = 2000, 
  delay = 0 
}: UseCounterAnimationProps) {
  const [count, setCount] = useState(start);
  const elementRef = useRef<HTMLDivElement>(null);
  const hasStartedRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasStartedRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const completeImmediately = () => {
      if (hasStartedRef.current) return;
      hasStartedRef.current = true;
      setCount(end);
    };

    const startAnimation = () => {
      if (hasStartedRef.current) return;

      hasStartedRef.current = true;

      const startTime = Date.now() + delay;
      const animateCount = () => {
        const now = Date.now();
        const elapsed = now - startTime;

        if (elapsed < 0) {
          animationFrameRef.current = requestAnimationFrame(animateCount);
          return;
        }

        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (end - start) * easeOut);

        setCount(current);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animateCount);
        }
      };

      animationFrameRef.current = requestAnimationFrame(animateCount);
    };

    if (prefersReducedMotion) {
      completeImmediately();
      return;
    }

    const checkVisibility = () => {
      if (hasStartedRef.current) return;

      const rect = element.getBoundingClientRect();
      const isVisible = rect.top <= window.innerHeight - 120 && rect.bottom >= 0;

      if (isVisible) {
        startAnimation();
      }
    };

    checkVisibility();

    window.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('resize', checkVisibility);

    return () => {
      window.removeEventListener('scroll', checkVisibility);
      window.removeEventListener('resize', checkVisibility);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [end, start, duration, delay]);

  return { count, elementRef };
}
