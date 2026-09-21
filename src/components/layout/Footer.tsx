import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Container } from '@/components/ui';
import { getEvent } from '@/lib/cms/public';
export async function Footer() {
  const event = await getEvent();
  return (
    <footer className="site-footer">
      <Container>
        <div className="footer-grid">
          <div>
            <p className="eyebrow">EGS Pillay Group of Institutions</p>
            <h2>
              Science Expo 2026<span className="accent-dot">.</span>
            </h2>
            <p>
              A meeting place for science, engineering
              <br />
              and the next generation of ideas.
            </p>
            <a className="text-link" href={event.institutionUrl} target="_blank" rel="noreferrer">
              Institution website <ArrowUpRight size={16} />
            </a>
          </div>
          <div>
            <h3>Discover</h3>
            <Link href="/about">About the expo</Link>
            <Link href="/themes">Expo themes</Link>
            <Link href="/projects">Projects & exhibits</Link>
            <Link href="/gallery">Gallery</Link>
          </div>
          <div>
            <h3>Plan your day</h3>
            <Link href="/schedule">Programme</Link>
            <Link href="/venue">Venue & directions</Link>
            <Link href="/participate">Participation</Link>
            <Link href="/faq">Common questions</Link>
          </div>
          <div>
            <h3>Stay connected</h3>
            <Link href="/updates">Latest updates</Link>
            <Link href="/help-desk">Help-desk teams</Link>
            <Link href="/contact">Contact the organisers</Link>
            <Link href="/admin">Organiser sign-in</Link>
            <p>{event.location}</p>
            <small>Official social links to be announced.</small>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 EGS Pillay Group of Institutions</span>
          <MotionControl />
        </div>
      </Container>
    </footer>
  );
}
import { MotionControl } from '@/components/motion/SiteMotion';
