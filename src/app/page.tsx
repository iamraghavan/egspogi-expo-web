import Link from 'next/link';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { Container, Button, SectionHeader, PreviewNote } from '@/components/ui';
import { GeometricScienceArtwork } from '@/components/expo/GeometricScienceArtwork';
import { ArtworkEntrance } from '@/components/expo/ArtworkEntrance';
import {
  EventInfoStrip,
  ThemeTile,
  ProjectCard,
  ScheduleItem,
  UpdateCard,
  FAQAccordion,
  VenueMap,
} from '@/components/expo/content';
import { GalleryGrid } from '@/components/expo/GalleryGrid';
import { themes } from '@/data/themes';
import {
  getProjects,
  getSchedule,
  getUpdates,
  getFaqs,
  getEvent,
  getGallery,
} from '@/lib/cms/public';
export default async function Home() {
  const [projects, schedule, updates, faqs, event, gallery] = await Promise.all([
    getProjects(),
    getSchedule(),
    getUpdates(),
    getFaqs(),
    getEvent(),
    getGallery(),
  ]);
  return (
    <>
      <section className="hero">
        <Container>
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">
                <span className="tiny-square" /> A campus full of possibilities
              </p>
              <h1>
                Science Expo
                <br /> <span>2026</span>
                <span className="hero-dot">.</span>
              </h1>
              <p className="hero-categories">Space · Satellite · Racing · Aero · Innovation</p>
              <p className="hero-description">
                A student-led science and engineering expo bringing together ideas, prototypes and
                emerging technologies across multiple disciplines.
              </p>
              <div className="button-row">
                <Button href="/themes" variant="light">
                  Explore the expo
                </Button>
                <Link href="/participate" className="hero-secondary">
                  Participate <ArrowUpRight size={18} aria-hidden="true" />
                </Link>
              </div>
              <div className="hero-footnote">
                <span>01 / 08</span>
                <span>Different disciplines. Shared curiosity.</span>
              </div>
            </div>
            <ArtworkEntrance>
              <GeometricScienceArtwork />
              <div className="art-caption">
                <span>Ideas in motion</span>
                <span>Science × Engineering × Imagination</span>
              </div>
            </ArtworkEntrance>
          </div>
        </Container>
      </section>
      <EventInfoStrip event={event} />
      <section className="section about-section">
        <Container>
          <div className="editorial-grid">
            <div>
              <p className="eyebrow">An invitation to be curious</p>
              <h2>
                See the idea.
                <br />
                Meet the minds behind it.
              </h2>
            </div>
            <div>
              <p className="lead">Science is more interesting when you can get close to it.</p>
              <p>
                Step into a campus where students turn classroom questions into working models.
                Explore the thinking, testing and teamwork behind every exhibit — and ask the
                questions that take an idea further.
              </p>
              <Link className="text-link" href="/about">
                Get to know the expo <ArrowRight size={18} />
              </Link>
              <div className="fact-row">
                <div>
                  <strong>08</strong>
                  <span>Science tracks</span>
                </div>
                <div>
                  <strong>Student-led</strong>
                  <span>Projects & prototypes</span>
                </div>
                <div>
                  <strong>Hands-on</strong>
                  <span>Live demonstrations</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
      <section className="section themes-section">
        <Container>
          <SectionHeader
            label="Explore the disciplines"
            title="Eight tracks. A world of connections."
            href="/themes"
            linkText="All expo themes"
          />
          <div className="themes-grid">
            {themes.map((theme, i) => (
              <ThemeTile key={theme.category} theme={theme} index={i} />
            ))}
          </div>
        </Container>
      </section>
      <section className="section">
        <Container>
          <SectionHeader
            label="Student work, centre stage"
            title="On the exhibition floor"
            description="Meet the student ideas and prototypes selected for the exhibition floor."
            href="/projects"
            linkText="Explore all projects"
          />
          <div className="project-grid">
            {projects
              .filter((p) => p.featured)
              .map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
          </div>
        </Container>
      </section>
      <section className="section programme-section">
        <Container>
          <div className="programme-grid">
            <div>
              <p className="eyebrow">The day at a glance</p>
              <h2>
                Make room
                <br />
                for discovery.
              </h2>
              <p>
                Exhibits to explore. Ideas to discuss.
                <br />
                Demonstrations to get you thinking.
              </p>
              <p className="programme-date">
                {event.date}
                <br />
                <span>{event.time} · Proposed programme</span>
              </p>
              <Button href="/schedule" variant="outline">
                View full schedule
              </Button>
            </div>
            <ol className="schedule-list">
              {schedule.map((item) => (
                <ScheduleItem key={item.time} item={item} />
              ))}
            </ol>
          </div>
        </Container>
      </section>
      <section className="section">
        <Container>
          <div className="participate-banner">
            <div>
              <p className="eyebrow">Bring your curiosity. Build something.</p>
              <h2>
                Your next idea
                <br />
                belongs here.
              </h2>
              <p>
                Open to student teams with a question worth exploring and a prototype, model or
                experiment to share.
              </p>
              <Button href="/help-desk/registration" variant="light">
                Offline registration details
              </Button>
            </div>
            <div className="participate-steps">
              <div>
                <span>01</span>
                <p>
                  <strong>Find your track</strong>Choose from eight science and engineering
                  disciplines.
                </p>
              </div>
              <div>
                <span>02</span>
                <p>
                  <strong>Shape your submission</strong>Prepare your abstract, team details and
                  demonstration plan.
                </p>
              </div>
              <div>
                <span>03</span>
                <p>
                  <strong>Visit the registration desk</strong>Register in person with the team. No
                  online registration is available.
                </p>
              </div>
              <Link href="/participate#dates">
                View important dates <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>
        </Container>
      </section>
      <section className="section updates-section">
        <Container>
          <SectionHeader
            label="From the organising desk"
            title="Latest updates"
            href="/updates"
            linkText="All announcements"
          />
          <div className="updates-grid">
            {updates.slice(0, 3).map((update) => (
              <UpdateCard key={update.slug} update={update} />
            ))}
          </div>
        </Container>
      </section>
      <section className="section">
        <Container>
          <div className="venue-grid">
            <div>
              <p className="eyebrow">Find your way here</p>
              <h2>
                A day on campus.
                <br />A different perspective.
              </h2>
              <p className="lead">{event.venue}</p>
              <p>
                {event.location}
                <br />
                Exhibition halls · Demonstration spaces · Student showcases
              </p>
              <a href={event.directionsUrl} className="text-link" target="_blank" rel="noreferrer">
                Get directions <ArrowUpRight size={18} />
              </a>
              <p className="small-note">
                Gate, parking and accessibility details will be confirmed before the event.
              </p>
            </div>
            <VenueMap />
          </div>
        </Container>
      </section>
      <section className="section gallery-section">
        <Container>
          <div className="playground-preview">
            <div>
              <p className="eyebrow">Science, in your hands</p>
              <h2>What happens when you change one thing?</h2>
              <p>
                Send a satellite signal, tilt an orbit or explore airflow in three interactive
                experiments.
              </p>
            </div>
            <Link href="/experience" className="button button-primary">
              Try the science playground <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <SectionHeader
            label="A glimpse of the experience"
            title="Ideas, people and possibilities"
            href="/gallery"
            linkText="Explore the gallery"
          />
          <GalleryGrid preview gallery={gallery} />
        </Container>
      </section>
      <section className="section">
        <Container>
          <div className="faq-grid">
            <div>
              <p className="eyebrow">Before you visit</p>
              <h2>A few useful answers.</h2>
              <p>
                Planning to exhibit or just looking around?
                <br />
                Start here.
              </p>
              <Link href="/faq" className="text-link">
                View all questions <ArrowUpRight size={18} />
              </Link>
            </div>
            <FAQAccordion items={faqs.slice(0, 4)} />
          </div>
          <PreviewNote />
        </Container>
      </section>
    </>
  );
}
