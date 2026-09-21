import type { MetadataRoute } from 'next';
import { event } from '@/data/event';
import { getProjects, getUpdates, getTeams } from '@/lib/cms/public';
export const dynamic = 'force-dynamic';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, updates, teams] = await Promise.all([getProjects(), getUpdates(), getTeams()]);
  return [
    '',
    '/about',
    '/experience',
    '/themes',
    '/projects',
    '/schedule',
    '/participate',
    '/updates',
    '/gallery',
    '/venue',
    '/faq',
    '/contact',
    '/help-desk',
    ...teams.map((team) => `/help-desk/${team.slug}`),
    ...projects.map((p) => `/projects/${p.slug}`),
    ...updates.map((u) => `/updates/${u.slug}`),
  ].map((path) => ({
    url: `${event.siteUrl}${path}`,
    changeFrequency: 'weekly',
    priority: path ? 0.7 : 1,
  }));
}
