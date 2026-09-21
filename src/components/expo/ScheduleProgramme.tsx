'use client';
import { useState } from 'react';
import type { SessionItem } from '@/lib/cms/public';
import { ScheduleItem } from './content';
export function ScheduleProgramme({ sessions }: { sessions: SessionItem[] }) {
  const days = [...new Set(sessions.map((s) => s.date))];
  const [day, setDay] = useState(days[0] || '');
  return (
    <>
      {days.length > 1 && (
        <div className="gallery-filters" aria-label="Programme day">
          {days.map((date, i) => (
            <button key={date} aria-pressed={date === day} onClick={() => setDay(date)}>
              Day {i + 1} ·{' '}
              {new Date(date).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                timeZone: 'UTC',
              })}
            </button>
          ))}
        </div>
      )}
      <p role="status" className="results-count">
        {sessions.filter((s) => s.date === day).length} sessions ·{' '}
        {day
          ? new Date(day).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              timeZone: 'UTC',
            })
          : 'Programme coming soon'}{' '}
        · All times IST
      </p>
      <ol className="schedule-list full-schedule">
        {sessions
          .filter((s) => s.date === day)
          .map((item) => (
            <ScheduleItem key={`${item.time}-${item.title}`} item={item} />
          ))}
      </ol>
    </>
  );
}
