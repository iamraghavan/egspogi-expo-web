'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useReducedMotion, toggleMotion } from './preferences';

export function MotionControl() {
  const reduced = useReducedMotion();
  return (
    <button className="motion-control" onClick={toggleMotion} aria-pressed={reduced}>
      Reduce motion: {reduced ? 'on' : 'off'}
    </button>
  );
}

export function SiteMotion() {
  const path = usePathname();
  const reduced = useReducedMotion();
  const progress = useRef<HTMLDivElement>(null);
  useEffect(() => {
    document.documentElement.dataset.reduceMotion = String(reduced);
    if (reduced) return;
    let disposed = false;
    let cleanup = () => {};
    void Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
      import('gsap/DrawSVGPlugin'),
      import('gsap/SplitText'),
    ])
      .then(([{ gsap }, { ScrollTrigger }, { DrawSVGPlugin }, { SplitText }]) => {
        if (disposed) return;
        gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, SplitText);
        const context = gsap.context(() => {
          if (progress.current)
            gsap.fromTo(
              progress.current,
              { scaleX: 0 },
              { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.2 } },
            );
          // Content stays visible without JavaScript. Admin forms never get scroll reveals.
          if (!path.startsWith('/admin')) {
            gsap.utils
              .toArray<HTMLElement>(
                '.section-header, .theme-tile, .project-card, .schedule-item, .update-row, .info-panel, .help-team-card',
              )
              .forEach((element) => {
                gsap.from(element, {
                  y: 16,
                  duration: 0.55,
                  ease: 'power2.out',
                  scrollTrigger: { trigger: element, start: 'top 94%', once: true },
                  clearProps: 'all',
                });
              });
            const heading = document.querySelector('main h1');
            if (heading) {
              const split = SplitText.create(heading, { type: 'words', aria: 'auto' });
              gsap.from(split.words, {
                y: 10,
                duration: 0.5,
                stagger: 0.035,
                onComplete: () => split.revert(),
              });
            }
            gsap.from('.hero-art path[fill="none"], .hero-art ellipse', {
              drawSVG: '0%',
              duration: 1,
              stagger: 0.08,
              ease: 'power1.inOut',
            });
          }
        });
        const hover = (event: PointerEvent) => {
          if (event.pointerType !== 'mouse') return;
          const target = (event.target as Element).closest<HTMLElement>(
            '.button, .header-cta, .admin-secondary',
          );
          if (target)
            context.add(() =>
              gsap.fromTo(
                target,
                { y: 0 },
                { y: -2, duration: 0.18, repeat: 1, yoyo: true, clearProps: 'transform' },
              ),
            );
        };
        document.addEventListener('pointerover', hover);
        cleanup = () => {
          document.removeEventListener('pointerover', hover);
          context.revert();
        };
      })
      .catch(() => {
        /* The complete site remains usable if optional motion cannot load. */
      });
    return () => {
      disposed = true;
      cleanup();
    };
  }, [path, reduced]);
  return <div ref={progress} className="reading-progress" aria-hidden="true" />;
}
