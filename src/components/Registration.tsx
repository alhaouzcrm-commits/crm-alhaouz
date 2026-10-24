import React, { useMemo } from 'react';
import type { Settings, CourseItem } from '../types';
import { getCleanWhatsApp } from '../utils';

interface RegistrationProps {
  settings: Settings;
  courses: CourseItem[];
}

export const Registration: React.FC<RegistrationProps> = ({ settings, courses }) => {
  const regCourses = courses.filter((c) => c.registration);

  const formEmbedUrl = useMemo(() => {
    try {
      if (!settings.training_form_url) return '';
      const u = new URL(settings.training_form_url);
      if (!/(^|\.)docs\.google\.com$/.test(u.hostname) || !u.pathname.startsWith('/forms/')) {
        return '';
      }
      u.pathname = u.pathname.replace(/\/(edit|viewform)?$/, '/viewform');
      u.search = '';
      u.searchParams.set('embedded', 'true');
      return u.toString();
    } catch {
      return '';
    }
  }, [settings.training_form_url]);

  const waNumber = getCleanWhatsApp(settings.whatsapp || '+212657048071');
  const waMessage = encodeURIComponent(
    'السلام عليكم، أرغب في التسجيل في إحدى الدورات التكوينية للهلال الأحمر المغربي بالحوز.'
  );

  return (
    <section className="register" id="register">
      <div className="wrap register-grid">
        <div className="register-info">
          <span className="kicker">التسجيل مفتوح</span>
          <h2>سجّل للاستفادة من دوراتنا التكوينية</h2>
          <p>
            املأ الاستمارة لتسجيل اهتمامك بإحدى الدورات، وسيتواصل معك المكتب الإقليمي عند برمجة الدورة المناسبة لك.
          </p>
          <ul className="reg-courses">
            {regCourses.map((c, idx) => (
              <li key={idx}>
                <span>{String(idx + 1).padStart(2, '0')}</span>
                {c.title}
              </li>
            ))}
          </ul>
          <ol className="reg-steps">
            <li>اختر الدورة أو الدورات التي تهمك</li>
            <li>أرسل الاستمارة</li>
            <li>نتصل بك لتأكيد موعد الدورة ومكانها</li>
          </ol>
        </div>

        <div className="form-shell">
          <div className="form-shell-bar">
            <span></span>
            <span></span>
            <span></span>
            <b>استمارة التسجيل في الدورات التكوينية</b>
          </div>
          <div className="form-embed">
            {formEmbedUrl ? (
              <>
                <iframe
                  src={formEmbedUrl}
                  title="استمارة التسجيل في الدورات التكوينية"
                  loading="lazy"
                >
                  جارٍ التحميل…
                </iframe>
                <a
                  className="form-open"
                  href={formEmbedUrl.replace('embedded=true', 'usp=sf_link')}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  الاستمارة لا تظهر؟ افتحها في صفحة مستقلة ↗
                </a>
              </>
            ) : (
              <div className="form-pending">
                <div className="fp-icon">✚</div>
                <h3>الاستمارة الإلكترونية قيد الإعداد</h3>
                <p>
                  إلى حين فتح التسجيل الإلكتروني، يمكنك تسجيل اهتمامك مباشرة عبر واتساب مع المكتب الإقليمي.
                </p>
                <a
                  className="btn btn-red"
                  href={`https://wa.me/${waNumber}?text=${waMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  التسجيل عبر واتساب
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
