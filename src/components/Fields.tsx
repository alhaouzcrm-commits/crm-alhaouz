import React from 'react';
import type { FieldItem } from '../types';

interface FieldsProps {
  fields: FieldItem[];
  onOpenFieldModal: (item: FieldItem, index: number) => void;
}

export const Fields: React.FC<FieldsProps> = ({ fields, onOpenFieldModal }) => {
  return (
    <section className="fields" id="fields">
      <div className="wrap">
        <div className="sec-head">
          <span className="kicker">مجالات التدخل</span>
          <h2>ستة مجالات وفريق واحد</h2>
          <p>اضغط على أي بطاقة لعرض أبرز ما أُنجز فيها.</p>
        </div>
        <div className="field-grid">
          {fields.map((f, idx) => (
            <button
              key={idx}
              className="field"
              onClick={() => onOpenFieldModal(f, idx)}
              type="button"
            >
              <img src={f.image} alt={f.title} loading="lazy" />
              <div className="field-inner">
                <span className="num">{String(idx + 1).padStart(2, '0')}</span>
                <h3>{f.title}</h3>
                <p>{f.summary}</p>
                <span className="more">اكتشف المزيد ←</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
