import React from 'react';
import type { Settings } from '../types';
import { extractDigits, formatLocalPhone, getCleanWhatsApp } from '../utils';

interface FooterProps {
  settings: Settings;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const currentYear = new Date().getFullYear();
  const waNumber = getCleanWhatsApp(settings.whatsapp || '+212668963619');

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer" id="contact">
      <div className="wrap footer-grid">
        <div>
          <a href="#top" className="brand brand-light" onClick={scrollToTop}>
            <svg className="crescent" viewBox="0 0 100 100" aria-hidden="true">
              <path d="M62 8a42 42 0 1 0 0 84 33 33 0 1 1 0-84z" />
            </svg>
            <span className="brand-text">
              <strong>الهلال الأحمر المغربي</strong>
              <small>المكتب الإقليمي · الحوز</small>
            </span>
          </a>
          <p className="muted-light">
            منظمة إنسانية غير ربحية: إنسانية، عدم تحيز، حياد، استقلال، تطوع، وحدة، عالمية.
          </p>
          {settings.facebook_url && (
            <div style={{ marginTop: '14px' }}>
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  borderColor: 'rgba(255,255,255,0.25)',
                  fontSize: '0.92rem',
                  padding: '0.5em 1.2em'
                }}
              >
                <img
                  src="/assets/aistudio/image_0902b870.png"
                  alt="فيسبوك"
                  style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'contain' }}
                />
                <span>صفحتنا على فيسبوك</span>
              </a>
            </div>
          )}
        </div>

        <div>
          <h4>تواصل معنا</h4>
          <ul className="contact-list">
            {settings.phones.map((p, idx) => (
              <li key={idx}>
                <span>الهاتف</span>
                <a href={`tel:${extractDigits(p.number)}`} dir="ltr">
                  {formatLocalPhone(p.number)}
                </a>
              </li>
            ))}
            <li>
              <span>واتساب</span>
              <a
                href={`https://wa.me/${waNumber}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                راسلنا مباشرة
              </a>
            </li>
            {settings.address && (
              <li>
                <span>العنوان</span>
                <span>{settings.address}</span>
              </li>
            )}
            {settings.facebook_name && (
              <li>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <img
                    src="/assets/aistudio/image_0902b870.png"
                    alt=""
                    style={{ width: '18px', height: '18px', borderRadius: '50%', objectFit: 'contain' }}
                  />
                  فيسبوك
                </span>
                {settings.facebook_url && /^https:\/\//.test(settings.facebook_url) ? (
                  <a
                    href={settings.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <span>{settings.facebook_name}</span>
                    <span style={{ opacity: 0.7, fontSize: '0.85em' }}>↗</span>
                  </a>
                ) : (
                  <span>{settings.facebook_name}</span>
                )}
              </li>
            )}
          </ul>
        </div>

        <div>
          <h4>روابط سريعة</h4>
          <ul className="links">
            <li><a href="#fields">مجالات التدخل</a></li>
            <li><a href="#quake">ملف زلزال الحوز</a></li>
            <li><a href="#guide">دليل الإسعافات الأولية</a></li>
            <li><a href="#join">تطوّع معنا</a></li>
          </ul>
        </div>
      </div>

      <div className="wrap footer-bottom">
        <span>© {currentYear} المكتب الإقليمي للهلال الأحمر المغربي بالحوز</span>
        <a href="#top" onClick={scrollToTop}>العودة للأعلى ↑</a>
      </div>
    </footer>
  );
};
