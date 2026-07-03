'use client';

import {
  createElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from 'react';

// useLayoutEffect on the client (hide before first paint → no flash),
// useEffect on the server (avoids the SSR warning; it's a no-op there).
const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface RevealProps {
  children: ReactNode;
  /** Extra classes merged onto the wrapper. */
  className?: string;
  /** Stagger step 1–4 → .reveal-delay-N. */
  delay?: 1 | 2 | 3 | 4;
  /** Wrapper element type (default 'div'). */
  as?: ElementType;
}

export default function Reveal({
  children,
  className = '',
  delay,
  as = 'div',
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  // SSR-safe: render revealed. Hidden on the client only when IO exists,
  // so no-JS / unsupported environments always show content.
  const [visible, setVisible] = useState(true);

  useIsoLayoutEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const node = ref.current;
    if (!node) return;

    setVisible(false);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const classes = [
    'reveal',
    visible && 'reveal-visible',
    delay && `reveal-delay-${delay}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return createElement(as, { ref, className: classes }, children);
}
