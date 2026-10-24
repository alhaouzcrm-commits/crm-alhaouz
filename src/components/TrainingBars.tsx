import React, { useEffect, useRef, useState } from 'react';
import { trainingBarsData } from '../data/initialData';
import { formatNumber } from '../utils';

export const TrainingBars: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);

  const maxLog = Math.log10(3600);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setAnimated(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="training">
      <div className="wrap training-grid">
        <div>
          <span className="kicker">التكوين</span>
          <h2>سلسلة التكوينات</h2>
          <p>
            دورات في الإسعافات الأولية الأساسية لفائدة التلاميذ والأطر التربوية ونساء المجتمع المدني والشباب، إلى جانب تكوينات خاصة بالمتطوعين على المستوى المحلي والجهوي والوطني والدولي.
          </p>
          <div className="chips">
            <span>الروابط العائلية</span>
            <span>الصحة المجتمعية</span>
            <span>التواصل</span>
            <span>الحكامة الرشيدة</span>
            <span>الأمن الإنساني</span>
            <span>الدعم النفسي</span>
            <span>اللوجستيك</span>
            <span>الإعلام</span>
            <span>مفهوم التطوع</span>
          </div>
        </div>

        <div className="bars" ref={sectionRef}>
          <h3 style={{ marginBottom: '20px' }}>عدد المستفيدين حسب نوع التكوين</h3>
          {trainingBarsData.map((bar, idx) => {
            const pct = Math.max(6, (Math.log10(bar.value) / maxLog) * 100);
            return (
              <div className="bar" key={idx}>
                <div className="bar-top">
                  <b>{bar.name}</b>
                  <span>{formatNumber(bar.value)} مستفيد · {bar.desc}</span>
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ width: animated ? `${pct}%` : '0%' }}
                  ></div>
                </div>
              </div>
            );
          })}
          <p style={{ margin: '16px 0 0', fontSize: '0.82rem', color: 'var(--muted)' }}>
            طول الأشرطة بمقياس لوغاريتمي حتى تظهر الأعداد الصغيرة بوضوح.
          </p>
        </div>
      </div>
    </section>
  );
};
