import { useEffect, useRef, useState } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
  reducedMotion?: boolean;
  staggerDelay?: number;
  fastStaggerDelay?: number;
}

export const SCROLL_REVEAL_OBSERVER_OPTIONS = {
  threshold: 0.12,
  rootMargin: '0px 0px -10% 0px',
  triggerOnce: true,
} as const;

export const SCROLL_REVEAL_TIMING = {
  section: 0,
  cardHeader: 90,
  subheading: 170,
  bodyBase: 250,
  bodyStep: 90,
  denseBase: 300,
  denseStep: 65,
} as const;

export type ScrollRevealStage = 'section' | 'cardHeader' | 'subheading' | 'body' | 'dense';

export function getScrollRevealDelay(stage: ScrollRevealStage, index = 0, offset = 0) {
  const position = Math.max(index + offset, 0);

  switch (stage) {
    case 'section':
      return SCROLL_REVEAL_TIMING.section;
    case 'cardHeader':
      return SCROLL_REVEAL_TIMING.cardHeader;
    case 'subheading':
      return SCROLL_REVEAL_TIMING.subheading;
    case 'body':
      return SCROLL_REVEAL_TIMING.bodyBase + position * SCROLL_REVEAL_TIMING.bodyStep;
    case 'dense':
      return SCROLL_REVEAL_TIMING.denseBase + position * SCROLL_REVEAL_TIMING.denseStep;
    default:
      return 0;
  }
}

export function getScrollRevealStyle(
  stageOrDelay: ScrollRevealStage | number,
  index = 0,
  offset = 0,
) {
  const delay =
    typeof stageOrDelay === 'number'
      ? stageOrDelay
      : getScrollRevealDelay(stageOrDelay, index, offset);

  return { transitionDelay: `${delay}ms` };
}

// Scroll animation hook with intersection-based reveal timing.
export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion && !options.reducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!options.triggerOnce || !hasTriggered.current)) {
          // Clear any existing timeout
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          
          timeoutRef.current = setTimeout(() => {
            setIsVisible(true);
            hasTriggered.current = true;
          }, options.delay || 0);
          
          if (options.triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!options.triggerOnce && !entry.isIntersecting) {
          // Clear timeout if element goes out of view
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          setIsVisible(false);
          hasTriggered.current = false;
        }
      },
      {
        threshold: options.threshold ?? SCROLL_REVEAL_OBSERVER_OPTIONS.threshold,
        rootMargin: options.rootMargin ?? SCROLL_REVEAL_OBSERVER_OPTIONS.rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [options.threshold, options.rootMargin, options.triggerOnce, options.delay, options.reducedMotion]);

  return { ref, isVisible };
}

export function useStaggeredScrollAnimation(
  itemCount: number,
  options: UseScrollAnimationOptions = {}
) {
  const [visibleItems, setVisibleItems] = useState(new Set<number>());
  const ref = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion && !options.reducedMotion) {
      // Show all items immediately if reduced motion is preferred
      setVisibleItems(new Set(Array.from({ length: itemCount }, (_, i) => i)));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!options.triggerOnce || !hasTriggered.current)) {
          const baseDelay = options.delay || 0;
          const staggerDelay = options.staggerDelay ?? 80;
          
          // Clear any existing timeouts
          timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
          timeoutsRef.current = [];
          
          // Trigger staggered animation (capped so long lists never leave late items blank)
          for (let i = 0; i < itemCount; i++) {
            const timeout = setTimeout(() => {
              setVisibleItems(prev => new Set([...Array.from(prev), i]));
            }, Math.min(baseDelay + (i * staggerDelay), 600));
            timeoutsRef.current.push(timeout);
          }
          
          hasTriggered.current = true;
          
          if (options.triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!options.triggerOnce && !entry.isIntersecting) {
          // Clear timeouts when element goes out of view
          timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
          timeoutsRef.current = [];
          setVisibleItems(new Set());
          hasTriggered.current = false;
        }
      },
      {
        threshold: options.threshold ?? SCROLL_REVEAL_OBSERVER_OPTIONS.threshold,
        rootMargin: options.rootMargin ?? SCROLL_REVEAL_OBSERVER_OPTIONS.rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      // Clear all timeouts on cleanup
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    };
  }, [itemCount, options.threshold, options.rootMargin, options.triggerOnce, options.delay, options.reducedMotion]);

  return { ref, visibleItems };
}

// Hook for initial page load animations
export function useInitialPageAnimation(delay: number = 0) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return isLoaded;
}
