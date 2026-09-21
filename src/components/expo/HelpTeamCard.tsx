import Link from 'next/link';
import { ArrowUpRight, Mail, Phone, MapPin, Clock3 } from 'lucide-react';
import type { HelpTeam } from '@/lib/cms/public';
export function TeamContact({ team }: { team: HelpTeam }) {
  return (
    <div className="team-contact">
      <dl>
        <dt>Contact person</dt>
        <dd>{team.person}</dd>
        <dt>
          <Mail size={16} aria-hidden="true" />
          Email
        </dt>
        <dd>{team.confirmed ? <a href={`mailto:${team.email}`}>{team.email}</a> : team.email}</dd>
        <dt>
          <Phone size={16} aria-hidden="true" />
          Phone
        </dt>
        <dd>
          {team.confirmed ? (
            <a href={`tel:${team.phone.replace(/[^+\d]/g, '')}`}>{team.phone}</a>
          ) : (
            team.phone
          )}
        </dd>
        <dt>
          <MapPin size={16} aria-hidden="true" />
          Find the desk
        </dt>
        <dd>{team.desk}</dd>
        <dt>
          <Clock3 size={16} aria-hidden="true" />
          Working hours
        </dt>
        <dd>{team.hours}</dd>
      </dl>
      {!team.confirmed && (
        <p className="dummy-note">
          Sample contacts · These dummy numbers and email addresses are not working contacts.
        </p>
      )}
    </div>
  );
}
export function HelpTeamCard({ team, index }: { team: HelpTeam; index: number }) {
  return (
    <article className="help-team-card">
      <p className="eyebrow">Help desk / {String(index + 1).padStart(2, '0')}</p>
      <h2>
        <Link href={`/help-desk/${team.slug}`}>{team.title}</Link>
      </h2>
      <p>{team.description}</p>
      <div className="help-contact-summary">
        <strong>{team.person}</strong>
        <span>{team.email}</span>
        <span>
          {team.phone}
          {!team.confirmed ? ' · Dummy number' : ''}
        </span>
      </div>
      <Link className="text-link" href={`/help-desk/${team.slug}`}>
        Team details & assistance <ArrowUpRight size={18} />
      </Link>
    </article>
  );
}
