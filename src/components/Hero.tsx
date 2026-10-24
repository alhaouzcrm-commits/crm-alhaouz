import React from 'react';
import type { Settings } from '../types';

interface HeroProps {
  settings: Settings;
}

export const Hero: React.FC<HeroProps> = ({ settings }) => {
  return (
    <section className="hero">
      <div className="hero-bg" style={{ backgroundImage: "url('/images/team.jpg')" }}></div>
      <div className="hero-shade"></div>
      
      {/* Atlas Mountain Silhouette SVG */}
      <svg className="hero-atlas" viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 220V150l80-40 70 30 110-90 90 70 60-30 120 100 90-60 70 20 130-110 100 80 80-40 110 70 90-50 120 60 120-40v150z" />
        <path className="snow" d="M260 50l-26 22 14-2 12 10 14-12 16 6zM650 10l-34 30 18-4 16 12 18-14 20 6z" />
      </svg>

      <div className="wrap hero-content">
        <p className="eyebrow">{settings.hero_eyebrow}</p>
        <h1>
          <span>{settings.hero_title_1}</span>
          <br />
          <span className="hl">{settings.hero_title_2}</span>
        </h1>
        <p className="lead">{settings.hero_lead}</p>
        <div className="hero-cta">
          <a href="#join" className="btn btn-red">انضم إلى المتطوعين</a>
          <a href="#numbers" className="btn btn-ghost">اكتشف حصيلتنا ↓</a>
        </div>
      </div>

      <div className="hero-badge" aria-hidden="true">
        <span>منذ</span>
        <b>{settings.since_year}</b>
        <span>في خدمة الإقليم</span>
      </div>
    </section>
  );
};
