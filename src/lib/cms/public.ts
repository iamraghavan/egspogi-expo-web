import 'server-only';
import { cache } from 'react';
import { published } from './store';
import { event } from '@/data/event';
import type { Project, Update } from '@/types';
export interface HelpTeam {
  title: string;
  slug: string;
  description: string;
  person: string;
  email: string;
  phone: string;
  desk: string;
  hours: string;
  responsibilities: string[];
  bring: string[];
  confirmed: boolean;
}
export interface GalleryItem {
  title: string;
  src: string;
  alt: string;
  category: string;
  illustration: boolean;
}
export interface SessionItem {
  title: string;
  date: string;
  time: string;
  end: string;
  location: string;
  description: string;
  sessionStatus: string;
}
export interface Notice {
  title: string;
  message: string;
  href: string;
  starts: string;
  expires: string;
  level: string;
}
export const getProjects = cache(() => published<Project>('projects'));
export const getUpdates = cache(async () =>
  (await published<Update>('updates')).sort((a, b) => b.date.localeCompare(a.date)),
);
export const getSchedule = cache(async () =>
  (await published<SessionItem>('schedule')).sort((a, b) =>
    `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`),
  ),
);
export const getGallery = cache(() => published<GalleryItem>('gallery'));
export const getTeams = cache(() => published<HelpTeam>('teams'));
export const getFaqs = cache(() => published<{ question: string; answer: string }>('faqs'));
export const getEvent = cache(async () => {
  const [settings] = await published<Record<string, unknown>>('event');
  if (!settings) return event;
  return {
    ...event,
    ...settings,
    registration: 'Offline registration only',
    dates: (settings.dates as string[]).map((line) => {
      const [label, ...value] = line.split(' | ');
      return { label, value: value.join(' | ') };
    }),
  } as typeof event;
});
export const getNotices = cache(async () => {
  const now = new Date().toISOString();
  return (await published<Notice>('notices')).filter(
    (n) => (!n.starts || n.starts <= now) && (!n.expires || n.expires > now),
  );
});
