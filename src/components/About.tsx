import React from 'react';

export const About: React.FC = () => {
  return (
    <section className="about" id="about">
      <div className="wrap about-grid">
        <div className="about-media">
          <img src="/images/atlas.jpg" alt="جبال الأطلس الكبير بإقليم الحوز" loading="lazy" />
          <img className="inset" src="/images/team3.jpg" alt="فريق متطوعي الهلال الأحمر بالحوز" loading="lazy" />
        </div>
        <div className="about-text">
          <span className="kicker">السياق التنظيمي</span>
          <h2>من نحن</h2>
          <p>
            الهلال الأحمر المغربي منظمة غير ربحية تعمل في مختلف أنحاء المملكة. وفي إقليم الحوز يشتغل تحت إشراف{' '}
            <strong>المكتب الإقليمي</strong> فريقٌ من المتطوعين والمتخصصين في الإسعافات الأولية والصحة العامة، ينفّذ أنشطة إنسانية وإغاثية في مناطق مختلفة من الإقليم.
          </p>
          <p>
            ويعمل المكتب بتنسيق مع السلطات المحلية والدرك الملكي والقوات المساعدة ووزارة التربية الوطنية ووزارة الصحة والوقاية المدنية، وله فرق ميدانية جاهزة للتدخل السريع في حالات الطوارئ، كما يحرص على تطوير مهارات متطوعيه بدورات تكوينية منتظمة.
          </p>
          <ul className="pill-list">
            <li>الإسعاف والإغاثة</li>
            <li>التكوين والتوعية</li>
            <li>الصحة المجتمعية</li>
            <li>الدعم النفسي</li>
            <li>إعادة الروابط العائلية</li>
          </ul>
          <div className="president">
            <div className="avatar">م.ع</div>
            <div>
              <b>المصطفى عصبان</b>
              <span>
                رئيس المكتب الإقليمي للهلال الأحمر المغربي بالحوز. جُدّدت فيه الثقة خلال الجمع العام التجديدي يوم 18 ماي 2025 بتحناوت، تقديرًا لجهوده وخبرته في العمل الإنساني.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
