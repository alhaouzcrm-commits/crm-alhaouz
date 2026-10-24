import React, { useState, useMemo } from 'react';
import type { TimelineItem } from '../types';

interface TimelineProps {
  timeline: TimelineItem[];
}

export const Timeline: React.FC<TimelineProps> = ({ timeline }) => {
  const [selectedYear, setSelectedYear] = useState<string>('الكل');

  const years = useMemo(() => {
    const unique = Array.from(new Set(timeline.map((e) => String(e.year)))).sort();
    return ['الكل', ...unique];
  }, [timeline]);

  const filteredEvents = useMemo(() => {
    if (selectedYear === 'الكل') return timeline;
    return timeline.filter((e) => String(e.year) === selectedYear);
  }, [timeline, selectedYear]);

  return (
    <section className="journey" id="journey">
      <div className="wrap">
        <div className="sec-head">
          <span className="kicker">المسار</span>
          <h2>محطات من 2022 إلى 2025</h2>
        </div>

        <div className="year-tabs" role="tablist">
          {years.map((y) => (
            <button
              key={y}
              role="tab"
              aria-selected={selectedYear === y}
              onClick={() => setSelectedYear(y)}
              type="button"
            >
              {y}
            </button>
          ))}
        </div>

        <ol className="timeline">
          {filteredEvents.map((e, idx) => (
            <li
              className="tl"
              key={`${e.year}-${e.date}-${idx}`}
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              <span className="tl-dot">{e.icon || '✚'}</span>
              <div className="tl-card">
                <time>{e.date} {e.year}</time>
                <h3>{e.title}</h3>
                <p>{e.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
