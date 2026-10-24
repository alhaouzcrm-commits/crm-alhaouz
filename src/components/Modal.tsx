import React, { useEffect, useRef } from 'react';
import type { ModalData } from '../types';
import { formatDateText } from '../utils';

interface ModalProps {
  data: ModalData;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ data, onClose }) => {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!data) return;

    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [data, onClose]);

  if (!data) return null;

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
    <div
      className="modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-card">
        <button
          ref={closeBtnRef}
          className="modal-x"
          onClick={onClose}
          aria-label="إغلاق"
          type="button"
        >
          ×
        </button>

        {data.type === 'news' && (
          <>
            {data.item.image && (
              <img className="m-hero" src={data.item.image} alt={data.item.title} />
            )}
            <div className="m-body">
              <span className="kicker">{formatDateText(data.item.date)}</span>
              <h2>{data.item.title}</h2>
              {data.item.subtitle && <p className="news-sub">{data.item.subtitle}</p>}
              {renderBody(data.item.body)}
            </div>
          </>
        )}

        {data.type === 'field' && (
          <>
            {data.item.image && (
              <img className="m-hero" src={data.item.image} alt={data.item.title} />
            )}
            <div className="m-body">
              <span className="kicker">
                مجال {String(data.index + 1).padStart(2, '0')}
              </span>
              <h2>{data.item.title}</h2>
              <ul>
                {data.item.points.map((pt, pIdx) => (
                  <li key={pIdx}>{pt}</li>
                ))}
              </ul>
              {data.item.photos && data.item.photos.length > 0 && (
                <div className="m-thumbs">
                  {data.item.photos.map((ph, phIdx) => (
                    <img key={phIdx} src={ph} alt="" loading="lazy" />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
