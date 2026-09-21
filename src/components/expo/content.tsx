import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowUpRight,
  CalendarDays,
  MapPin,
  Ticket,
  Users,
  Rocket,
  Satellite,
  Flag,
  Plane,
  Bot,
  Atom,
  Sigma,
  Cog,
} from 'lucide-react';
import { event as defaultEvent } from '@/data/event';
import { Container } from '@/components/ui';
import type { ExpoTheme, Project, Update } from '@/types';
import type { SessionItem } from '@/lib/cms/public';
export { CampusMap as VenueMap } from './CampusMap';
const icons = {
  Space: Rocket,
  Satellite,
  Racing: Flag,
  Aero: Plane,
  Robotics: Bot,
  Physics: Atom,
  Mathematics: Sigma,
  Engineering: Cog,
};
export function EventInfoStrip({ event = defaultEvent }: { event?: typeof defaultEvent }) {
  const info = [
    { icon: CalendarDays, label: 'Date', value: event.date },
    { icon: MapPin, label: 'Venue', value: event.venue },
    { icon: Ticket, label: 'Registration', value: event.registration },
    { icon: Users, label: 'Open to', value: event.audience },
  ];
  return (
    <div className="event-strip">
      <Container>
        <div className="event-info">
          {info.map(({ icon: Icon, label, value }) => (
            <div key={label}>
              <Icon size={22} aria-hidden="true" />
              <span>
                <small>{label}</small>
                <strong>{value}</strong>
              </span>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
export function ThemeTile({ theme, index }: { theme: ExpoTheme; index: number }) {
  const Icon = icons[theme.category];
  return (
    <Link
      href={`/projects?category=${theme.category}`}
      className={`theme-tile theme-${theme.color}`}
    >
      <div className="theme-tile-top">
        <span className="theme-icon">
          <Icon size={30} strokeWidth={1.6} aria-hidden="true" />
        </span>
        <span className="theme-number">0{index + 1}</span>
      </div>
      <h3>{theme.title}</h3>
      <p>{theme.description}</p>
      <ArrowUpRight className="tile-arrow" size={20} aria-hidden="true" />
    </Link>
  );
}
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card">
      <Link
        href={`/projects/${project.slug}`}
        className="project-image"
        tabIndex={-1}
        aria-hidden="true"
      >
        <Image
          src={project.image}
          alt=""
          width={720}
          height={480}
          sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw"
        />
      </Link>
      <div className="project-meta">
        <span>{project.category}</span>
        <span>{project.sample ? 'Concept exhibit' : 'Student exhibit'}</span>
      </div>
      <h3>
        <Link href={`/projects/${project.slug}`}>{project.title}</Link>
      </h3>
      <p>{project.description}</p>
      <p className="team-name">
        {project.team} <span> / {project.institution}</span>
      </p>
      <Link className="text-link" href={`/projects/${project.slug}`}>
        View project <ArrowUpRight size={16} aria-hidden="true" />
      </Link>
    </article>
  );
}
export function ScheduleItem({ item }: { item: SessionItem }) {
  return (
    <li className="schedule-item">
      <time>{item.time}</time>
      <div>
        <h3>{item.title}</h3>
        {item.sessionStatus !== 'Scheduled' && (
          <span className="session-status">{item.sessionStatus}</span>
        )}
        <p>{item.description}</p>
      </div>
      <span className="schedule-location">
        <MapPin size={15} aria-hidden="true" />
        {item.location}
      </span>
    </li>
  );
}
export function UpdateCard({ update }: { update: Update }) {
  return (
    <article className="update-card">
      <div className="update-meta">
        <span>{update.category}</span>
        <time dateTime={update.date}>
          {new Date(update.date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            timeZone: 'UTC',
          })}
        </time>
      </div>
      <h3>
        <Link href={`/updates/${update.slug}`}>{update.title}</Link>
      </h3>
      <p>{update.excerpt}</p>
      <Link className="text-link" href={`/updates/${update.slug}`}>
        Read update <ArrowUpRight size={16} aria-hidden="true" />
      </Link>
    </article>
  );
}
export function FAQAccordion({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <div className="faq-list">
      {items.map((item) => (
        <details key={item.question}>
          <summary>
            {item.question}
            <span aria-hidden="true">+</span>
          </summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
