import React, { useState, useMemo } from 'react';
import type { GalleryItem } from '../types';

interface GalleryProps {
  gallery: GalleryItem[];
  onOpenLightbox: (item: GalleryItem, index: number, filteredList: GalleryItem[]) => void;
}

const CATEGORIES: { [key: string]: string } = {
  all: 'الكل',
  fa: 'التكوين',
  h: 'الصحة',
  eq: 'الزلزال',
  s: 'الرياضة',
  r: 'السلامة الطرقية',
  so: 'التضامن',
};

export const Gallery: React.FC<GalleryProps> = ({ gallery, onOpenLightbox }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const visibleCategories = useMemo(() => {
    return Object.entries(CATEGORIES).filter(
      ([key]) => key === 'all' || gallery.some((g) => g.category === key)
    );
  }, [gallery]);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return gallery;
    return gallery.filter((g) => g.category === activeCategory);
  }, [gallery, activeCategory]);

  return (
    <section className="gallery" id="gallery">
      <div className="wrap">
        <div className="sec-head">
          <span className="kicker">المعرض</span>
          <h2>صور من الميدان</h2>
        </div>

        <div className="filters">
          {visibleCategories.map(([key, label]) => (
            <button
              key={key}
              className={activeCategory === key ? 'on' : ''}
              onClick={() => setActiveCategory(key)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="masonry">
          {filteredItems.map((item, idx) => (
            <figure
              key={`${item.image}-${idx}`}
              onClick={() => onOpenLightbox(item, idx, filteredItems)}
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              <img src={item.image} alt={item.caption} loading="lazy" />
              <figcaption>{item.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
