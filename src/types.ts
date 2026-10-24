export interface Phone {
  label: string;
  number: string;
}

export interface Settings {
  hero_eyebrow: string;
  hero_title_1: string;
  hero_title_2: string;
  hero_lead: string;
  since_year: string;
  phones: Phone[];
  whatsapp: string;
  address: string;
  facebook_name: string;
  facebook_url: string;
  training_form_url: string;
}

export interface StatItem {
  value: number;
  label: string;
}

export interface StatsData {
  title: string;
  subtitle: string;
  items: StatItem[];
}

export interface NewsItem {
  title: string;
  subtitle?: string;
  date: string;
  image?: string;
  body: string;
}

export interface Member {
  name: string;
  role: string;
  lead: boolean;
}

export interface Pillar {
  title: string;
  text: string;
}

export interface OfficeData {
  members: Member[];
  roadmap_title: string;
  roadmap_intro: string;
  pillars: Pillar[];
}

export interface CourseItem {
  title: string;
  registration: boolean;
}

export interface FieldItem {
  title: string;
  summary: string;
  image: string;
  points: string[];
  photos: string[];
}

export interface TimelineItem {
  year: string;
  date: string;
  icon: string;
  title: string;
  text: string;
}

export interface GalleryItem {
  image: string;
  category: string;
  caption: string;
}

export interface PartnerItem {
  name: string;
}

export interface GuideStep {
  k: string;
  i: string;
  t: string;
  w: string;
  s: string[];
  metro?: boolean;
}

export type ModalData =
  | { type: 'news'; item: NewsItem }
  | { type: 'field'; item: FieldItem; index: number }
  | null;
