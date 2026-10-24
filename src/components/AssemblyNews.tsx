import React from 'react';
import type { NewsItem, OfficeData, CourseItem } from '../types';
import { parseDate, formatDateText } from '../utils';

interface AssemblyNewsProps {
  news: NewsItem[];
  office: OfficeData;
  courses: CourseItem[];
  onOpenNewsModal: (item: NewsItem) => void;
}

export const AssemblyNews: React.FC<AssemblyNewsProps> = ({
  news,
  office,
  courses,
  onOpenNewsModal,
}) => {
  const sortedNews = [...news].sort((a, b) =>
    String(b.date || '').localeCompare(String(a.date || ''))
  );
  const topNews = sortedNews[0];
  const olderNews = sortedNews.slice(1);

  const topDate = topNews ? parseDate(topNews.date) : null;

  const renderBody = (body: string) => {
    return body.split(/\r?\n\s*\r?\n/).map((block, bIdx) => {
      const lines = block.split(/\r?\n/).filter(Boolean);
      const renderLine = (str: string) => {
        const parts = str.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
          }
          return part;
        });
      };

      if (lines.length && lines.every((l) => /^\s*[*-]\s+/.test(l))) {
        return (
          <ul key={bIdx}>
            {lines.map((l, lIdx) => (
              <li key={lIdx}>{renderLine(l.replace(/^\s*[*-]\s+/, ''))}</li>
            ))}
          </ul>
        );
      }

      if (lines.length && lines.every((l) => /^\s*\d+[.)]\s+/.test(l))) {
        return (
          <ol key={bIdx}>
            {lines.map((l, lIdx) => (
              <li key={lIdx}>{renderLine(l.replace(/^\s*\d+[.)]\s+/, ''))}</li>
            ))}
          </ol>
        );
      }

      return (
        <p key={bIdx}>
          {lines.map((line, lIdx) => (
            <React.Fragment key={lIdx}>
              {lIdx > 0 && <br />}
              {renderLine(line)}
            </React.Fragment>
          ))}
        </p>
      );
    });
  };

  return (
    <section className="assembly" id="assembly">
      <div className="wrap">
        {/* Latest News */}
        {topNews && (
          <div className="news-list">
            <article className="news-card">
              {topDate && (
                <div className="news-date" aria-hidden="true">
                  <b>{topDate.d}</b>
                  <span>{topDate.m}</span>
                  <span>{topDate.y}</span>
                </div>
              )}
              <div className="news-text">
                <span className="kicker">آخر الأخبار</span>
                <h2>{topNews.title}</h2>
                {topNews.subtitle && <p className="news-sub">{topNews.subtitle}</p>}
                {topNews.image && (
                  <img
                    className="news-img"
                    src={topNews.image}
                    alt={topNews.title}
                    loading="lazy"
                  />
                )}
                {renderBody(topNews.body)}
              </div>
            </article>

            {olderNews.length > 0 && (
              <>
                <h3 className="news-more-title">أخبار سابقة</h3>
                <div className="news-grid">
                  {olderNews.map((n, idx) => (
                    <button
                      key={idx}
                      className="news-mini"
                      onClick={() => onOpenNewsModal(n)}
                      type="button"
                    >
                      {n.image && <img src={n.image} alt={n.title} loading="lazy" />}
                      <span className="nm-date">{formatDateText(n.date)}</span>
                      <b>{n.title}</b>
                      {n.subtitle && <span className="nm-sub">{n.subtitle}</span>}
                      <span className="more">اقرأ الخبر ←</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Board Members */}
        <div className="sec-head board-head">
          <span className="kicker">التشكيلة الجديدة</span>
          <h2>أعضاء المكتب الإقليمي</h2>
        </div>
        <ul className="board">
          {office.members.map((m, idx) => {
            const initial = Array.from(m.name.trim())[0] || '';
            return (
              <li key={idx} className={m.lead ? 'board-lead' : ''}>
                <span className="b-ini">{initial}</span>
                <b>{m.name}</b>
                <span>{m.role}</span>
              </li>
            );
          })}
        </ul>

        {/* Strategic Roadmap */}
        <div className="roadmap">
          <div className="roadmap-intro">
            <span className="kicker">خارطة الطريق</span>
            <h2>{office.roadmap_title}</h2>
            <p>{office.roadmap_intro}</p>
          </div>
          <ol className="pillars">
            {office.pillars.map((p, idx) => (
              <li key={idx}>
                <b>{p.title}</b>
                <span>{p.text}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Training Offerings */}
        <div className="courses">
          <div>
            <span className="kicker">عرض التكوين</span>
            <h3>دورات تكوينية يعمل المكتب على تنظيمها</h3>
            <p>
              في إطار تطوير قدرات الموارد البشرية وتأهيل المتطوعات والمتطوعين، يولي المكتب الإقليمي أهمية خاصة للتكوين والتأطير.
            </p>
            <a href="#register" className="btn btn-red btn-sm">سجّل في دورة تكوينية</a>
          </div>
          <ol className="course-list">
            {courses.map((c, idx) => (
              <li key={idx}>{c.title}</li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};
