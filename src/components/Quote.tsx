import React from 'react';

export const Quote: React.FC = () => {
  return (
    <section className="quote-strip">
      <div className="wrap">
        <span className="q-tag">مقولة</span>
        <blockquote>
          «العمل التطوعي والمشاركة في بناء المجتمع، بأي طريقة من الطرق، تساعد على النهضة والتطوير، كما تكون طريقة داعمة للتغيير والإصلاح.»
        </blockquote>
      </div>
    </section>
  );
};
