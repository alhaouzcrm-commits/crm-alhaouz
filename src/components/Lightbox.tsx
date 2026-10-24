import React, { useEffect, useRef } from 'react';
import type { GalleryItem } from '../types';

interface LightboxProps {
  isOpen: boolean;
  item: GalleryItem | null;
  items: GalleryItem[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  item,
  items,
  currentIndex,
  onClose,
  onNavigate,
}) => {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        // Next item in RTL
        onNavigate((currentIndex + 1) % items.length);
      } else if (e.key === 'ArrowRight') {
        // Prev item in RTL
        onNavigate((currentIndex - 1 + items.length) % items.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, items.length, currentIndex, onClose, onNavigate]);

  if (!isOpen || !item) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate((currentIndex - 1 + items.length) % items.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate((currentIndex + 1) % items.length);
  };

  return (
    <div
      className="lightbox"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <button
        ref={closeBtnRef}
        className="lb-btn lb-x"
        onClick={onClose}
        aria-label="إغلاق"
        type="button"
      >
        ×
      </button>

      {items.length > 1 && (
        <button
          className="lb-btn lb-prev"
          onClick={handlePrev}
          aria-label="السابق"
          type="button"
        >
          ›
        </button>
      )}

      <figure onClick={(e) => e.stopPropagation()}>
        <img src={item.image} alt={item.caption} />
        {item.caption && <figcaption>{item.caption}</figcaption>}
      </figure>

      {items.length > 1 && (
        <button
          className="lb-btn lb-next"
          onClick={handleNext}
          aria-label="التالي"
          type="button"
        >
          ‹
        </button>
      )}
    </div>
  );
};
