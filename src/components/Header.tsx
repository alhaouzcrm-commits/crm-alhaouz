import React, { useState, useEffect } from 'react';
import type { Settings } from '../types';
import { extractDigits } from '../utils';

interface HeaderProps {
  settings: Settings;
}

export const Header: React.FC<HeaderProps> = ({ settings }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setTheme(savedTheme);
        document.documentElement.dataset.theme = savedTheme;
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
        document.documentElement.dataset.theme = 'dark';
      }
    } catch {
      // ignore localStorage errors
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    try {
      localStorage.setItem('theme', nextTheme);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'assembly', 'register', 'fields', 'quake', 'journey', 'guide', 'gallery', 'contact'];
      const scrollPos = window.scrollY + 120;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* SOS Emergency Bar */}
      <div className="sos-bar">
        <div className="wrap sos-inner">
          <span className="sos-label">
            <span className="pulse"></span> أرقام الطوارئ
          </span>
          <a href="tel:15">الوقاية المدنية <b>15</b></a>
          <a href="tel:141">الإسعاف الطبي <b>141</b></a>
          <a href="tel:19">الشرطة <b>19</b></a>
          <a href="tel:177">الدرك الملكي <b>177</b></a>
          <span className="sos-phones">
            {settings.phones.map((p, idx) => (
              <a
                key={idx}
                className="sos-branch"
                href={`tel:${extractDigits(p.number)}`}
              >
                {p.label || 'الهلال الأحمر – الحوز'} <b dir="ltr">{p.number}</b>
              </a>
            ))}
          </span>
        </div>
      </div>

      {/* Main Header */}
      <header className="site-header" id="top">
        <div className="wrap header-inner">
          <a href="#top" className="brand" aria-label="الصفحة الرئيسية">
            <svg className="crescent" viewBox="0 0 100 100" aria-hidden="true">
              <path d="M62 8a42 42 0 1 0 0 84 33 33 0 1 1 0-84z" />
            </svg>
            <span className="brand-text">
              <strong>الهلال الأحمر المغربي</strong>
              <small>المكتب الإقليمي · الحوز</small>
            </span>
          </a>

          <nav className={`nav ${menuOpen ? 'open' : ''}`} id="nav">
            <a href="#about" className={activeSection === 'about' ? 'active' : ''} onClick={closeMenu}>من نحن</a>
            <a href="#assembly" className={activeSection === 'assembly' ? 'active' : ''} onClick={closeMenu}>الأخبار والمكتب</a>
            <a href="#register" className={activeSection === 'register' ? 'active' : ''} onClick={closeMenu}>التسجيل</a>
            <a href="#fields" className={activeSection === 'fields' ? 'active' : ''} onClick={closeMenu}>مجالاتنا</a>
            <a href="#quake" className={activeSection === 'quake' ? 'active' : ''} onClick={closeMenu}>زلزال الحوز</a>
            <a href="#journey" className={activeSection === 'journey' ? 'active' : ''} onClick={closeMenu}>المسار</a>
            <a href="#guide" className={activeSection === 'guide' ? 'active' : ''} onClick={closeMenu}>دليل الإسعاف</a>
            <a href="#gallery" className={activeSection === 'gallery' ? 'active' : ''} onClick={closeMenu}>المعرض</a>
            <a href="#contact" className={activeSection === 'contact' ? 'active' : ''} onClick={closeMenu}>اتصل بنا</a>
          </nav>

          <div className="header-actions">
            {settings.facebook_url && (
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-btn"
                aria-label="صفحتنا على فيسبوك"
                title="صفحتنا على فيسبوك"
                style={{ padding: '8px' }}
              >
                <img
                  src="/assets/aistudio/image_0902b870.png"
                  alt="فيسبوك"
                  style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'contain' }}
                />
              </a>
            )}
            <button
              className="icon-btn"
              id="themeBtn"
              onClick={toggleTheme}
              aria-label="تبديل الوضع الليلي"
              title={theme === 'dark' ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'}
            >
              <svg viewBox="0 0 24 24">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
              </svg>
            </button>
            <a href="#join" className="btn btn-red btn-sm">تطوّع معنا</a>
            <button
              className="icon-btn menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="القائمة"
              aria-expanded={menuOpen}
            >
              <svg viewBox="0 0 24 24">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
