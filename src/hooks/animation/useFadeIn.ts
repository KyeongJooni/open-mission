import { useRef, useEffect, useState, RefObject } from 'react';

interface FadeInOptions {
  threshold?: number;
  delay?: number;
}

export const useFadeIn = <T extends HTMLElement>(options: FadeInOptions = {}): [RefObject<T | null>, boolean] => {
  const { threshold = 0.1, delay = 0 } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, delay]);

  return [ref, isVisible];
};
