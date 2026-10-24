import React from 'react';
import type { PartnerItem } from '../types';

interface ThanksProps {
  partners: PartnerItem[];
}

export const Thanks: React.FC<ThanksProps> = ({ partners }) => {
  const partnerNames = partners.map((p) => p.name).filter(Boolean);
  // Double list for infinite marquee animation
  const marqueeList = [...partnerNames, ...partnerNames];

  return (
    <section className="thanks">
      <div className="wrap">
        <h2>شكر وتقدير</h2>
        <p>
          يتقدم المكتب الإقليمي بالشكر إلى عامل صاحب الجلالة على إقليم الحوز، وإلى المديريات الإقليمية للتربية الوطنية والصحة، والوقاية المدنية، والدرك الملكي، والسلطات المحلية، والجماعات الترابية، والمؤسسات التعليمية، والجمعيات الشريكة، وإلى كل المتطوعات والمتطوعين الذين عملوا بجدّ وتفانٍ في جميع المحطات.
        </p>
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {marqueeList.map((name, idx) => (
              <span key={idx}>{name}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
