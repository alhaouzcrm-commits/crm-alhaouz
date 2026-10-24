import { useState, useEffect } from 'react';
import type {
  Settings,
  StatsData,
  NewsItem,
  OfficeData,
  CourseItem,
  FieldItem,
  TimelineItem,
  GalleryItem,
  PartnerItem,
  ModalData,
} from './types';
import {
  initialSettings,
  initialStats,
  initialNews,
  initialOffice,
  initialCourses,
  initialFields,
  initialTimeline,
  initialGallery,
  initialPartners,
} from './data/initialData';

import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Quote } from './components/Quote';
import { Numbers } from './components/Numbers';
import { About } from './components/About';
import { AssemblyNews } from './components/AssemblyNews';
import { Registration } from './components/Registration';
import { Fields } from './components/Fields';
import { Quake } from './components/Quake';
import { TrainingBars } from './components/TrainingBars';
import { Timeline } from './components/Timeline';
import { FirstAidGuide } from './components/FirstAidGuide';
import { Gallery } from './components/Gallery';
import { JoinForm } from './components/JoinForm';
import { Thanks } from './components/Thanks';
import { Footer } from './components/Footer';
import { Modal } from './components/Modal';
import { Lightbox } from './components/Lightbox';

export function App() {
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [stats, setStats] = useState<StatsData>(initialStats);
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [office, setOffice] = useState<OfficeData>(initialOffice);
  const [courses, setCourses] = useState<CourseItem[]>(initialCourses);
  const [fields, setFields] = useState<FieldItem[]>(initialFields);
  const [timeline, setTimeline] = useState<TimelineItem[]>(initialTimeline);
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery);
  const [partners, setPartners] = useState<PartnerItem[]>(initialPartners);

  const [modalData, setModalData] = useState<ModalData>(null);
  const [lightboxState, setLightboxState] = useState<{
    isOpen: boolean;
    item: GalleryItem | null;
    items: GalleryItem[];
    currentIndex: number;
  }>({
    isOpen: false,
    item: null,
    items: [],
    currentIndex: 0,
  });

  // Attempt to load fresh dynamic JSON content from public/content/ if modified
  useEffect(() => {
    const loadJson = async <T,>(name: string): Promise<T | null> => {
      try {
        const res = await fetch(`/content/${name}.json`, { cache: 'no-cache' });
        if (res.ok) {
          return (await res.json()) as T;
        }
      } catch {
        // use fallback initial state
      }
      return null;
    };

    const fetchAll = async () => {
      const [
        dynSettings,
        dynStats,
        dynNews,
        dynOffice,
        dynCourses,
        dynFields,
        dynTimeline,
        dynGallery,
        dynPartners,
      ] = await Promise.all([
        loadJson<Settings>('settings'),
        loadJson<StatsData>('stats'),
        loadJson<{ items: NewsItem[] }>('news'),
        loadJson<OfficeData>('office'),
        loadJson<{ items: CourseItem[] }>('courses'),
        loadJson<{ items: FieldItem[] }>('fields'),
        loadJson<{ items: TimelineItem[] }>('timeline'),
        loadJson<{ items: GalleryItem[] }>('gallery'),
        loadJson<{ items: PartnerItem[] }>('partners'),
      ]);

      if (dynSettings) setSettings(dynSettings);
      if (dynStats) setStats(dynStats);
      if (dynNews?.items) setNews(dynNews.items);
      if (dynOffice) setOffice(dynOffice);
      if (dynCourses?.items) setCourses(dynCourses.items);
      if (dynFields?.items) setFields(dynFields.items);
      if (dynTimeline?.items) setTimeline(dynTimeline.items);
      if (dynGallery?.items) setGallery(dynGallery.items);
      if (dynPartners?.items) setPartners(dynPartners.items);
    };

    fetchAll();
  }, []);

  // Smooth scroll animations on viewport entrance
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const revealElements = document.querySelectorAll('section > .wrap > *:not(.hero-content)');
    revealElements.forEach((el) => {
      if (!el.closest('.hero')) {
        el.classList.add('reveal');
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  const handleOpenNewsModal = (item: NewsItem) => {
    setModalData({ type: 'news', item });
  };

  const handleOpenFieldModal = (item: FieldItem, index: number) => {
    setModalData({ type: 'field', item, index });
  };

  const handleOpenLightbox = (item: GalleryItem, index: number, list: GalleryItem[]) => {
    setLightboxState({
      isOpen: true,
      item,
      items: list,
      currentIndex: index,
    });
  };

  const handleNavigateLightbox = (newIndex: number) => {
    setLightboxState((prev) => ({
      ...prev,
      currentIndex: newIndex,
      item: prev.items[newIndex] || null,
    }));
  };

  return (
    <>
      <Header settings={settings} />

      <main>
        <Hero settings={settings} />
        <Quote />
        <Numbers stats={stats} />
        <About />
        <AssemblyNews
          news={news}
          office={office}
          courses={courses}
          onOpenNewsModal={handleOpenNewsModal}
        />
        <Registration settings={settings} courses={courses} />
        <Fields fields={fields} onOpenFieldModal={handleOpenFieldModal} />
        <Quake />
        <TrainingBars />
        <Timeline timeline={timeline} />
        <FirstAidGuide />
        <Gallery gallery={gallery} onOpenLightbox={handleOpenLightbox} />
        <JoinForm settings={settings} />
        <Thanks partners={partners} />
      </main>

      <Footer settings={settings} />

      <Modal data={modalData} onClose={() => setModalData(null)} />

      <Lightbox
        isOpen={lightboxState.isOpen}
        item={lightboxState.item}
        items={lightboxState.items}
        currentIndex={lightboxState.currentIndex}
        onClose={() => setLightboxState((prev) => ({ ...prev, isOpen: false }))}
        onNavigate={handleNavigateLightbox}
      />
    </>
  );
}

export default App;
