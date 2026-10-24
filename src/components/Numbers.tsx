import React, { useEffect, useRef, useState } from 'react';
import type { StatsData } from '../types';
import { formatNumber } from '../utils';

interface NumbersProps {
  stats: StatsData;
}

export const Numbers: React.FC<NumbersProps> = ({ stats }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [counts, setCounts] = useState<number[]>(() => stats.items.map(() => 0));
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1600;
          const start = performance.now();

          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(1, elapsed / duration);
            // Cubic ease out: 1 - (1 - p)^3
            const ease = 1 - Math.pow(1 - progress, 3);

            setCounts(stats.items.map((item) => Math.round(item.value * ease)));

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCounts(stats.items.map((item) => item.value));
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [stats]);

  return (
    <section className="numbers" id="numbers" ref={sectionRef}>
      <div className="wrap">
        <div className="sec-head light">
          <span className="kicker">الحصيلة بالأرقام</span>
          <h2>{stats.title}</h2>
          <p>{stats.subtitle}</p>
        </div>
        <div className="stat-grid">
          {stats.items.map((item, idx) => (
            <div className="stat" key={idx}>
              <b>{formatNumber(counts[idx] ?? item.value)}</b>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
