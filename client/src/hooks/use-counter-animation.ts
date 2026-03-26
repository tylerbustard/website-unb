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
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const hasStartedRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const fallbackTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasStarted) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const completeImmediately = () => {
      if (hasStartedRef.current) return;
      hasStartedRef.current = true;
      setHasStarted(true);
      setCount(end);
    };

    const startAnimation = () => {
      if (hasStartedRef.current) return;

      hasStartedRef.current = true;
      setHasStarted(true);

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

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      completeImmediately();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          startAnimation();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px 180px 0px'
      }
    );

    observer.observe(element);

    // Fallback: do not leave semantic values at zero if the section is never scrolled into view.
    fallbackTimeoutRef.current = window.setTimeout(() => {
      if (!hasStartedRef.current) {
        completeImmediately();
      }
    }, Math.max(delay + 1200, 1600));

    return () => {
      observer.unobserve(element);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (fallbackTimeoutRef.current) {
        window.clearTimeout(fallbackTimeoutRef.current);
      }
    };
  }, [end, start, duration, delay, hasStarted]);

  return { count, elementRef };
}
