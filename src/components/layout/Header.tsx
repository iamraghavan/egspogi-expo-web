'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/components/motion/preferences';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';
import { exploreNav, primaryNav } from '@/data/event';
import { Container } from '@/components/ui';
export function MobileMenu({ close }: { close: () => void }) {
  const path = usePathname();
  const reduced = useReducedMotion();
  return (
    <motion.nav
      initial={reduced ? false : { opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      id="mobile-navigation"
      className="mobile-menu"
      aria-label="Mobile navigation"
    >
      {[...primaryNav, ...exploreNav].map((link) => (
        <Link
          onClick={close}
          key={link.href}
          href={link.href}
          aria-current={path === link.href ? 'page' : undefined}
        >
          {link.label}
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      ))}
    </motion.nav>
  );
}
export function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const dropdown = useRef<HTMLDetailsElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (open) {
          setOpen(false);
          menuButton.current?.focus();
        }
        if (dropdown.current?.open) {
          dropdown.current.open = false;
          dropdown.current.querySelector('summary')?.focus();
        }
      }
    };
    const outside = (e: PointerEvent) => {
      if (dropdown.current && !dropdown.current.contains(e.target as Node))
        dropdown.current.open = false;
    };
    document.addEventListener('keydown', handler);
    document.addEventListener('pointerdown', outside);
    return () => {
      document.removeEventListener('keydown', handler);
      document.removeEventListener('pointerdown', outside);
    };
  }, [open]);
  return (
    <header className="site-header">
      <Container>
        <div className="header-row">
          <Link href="/" className="brand" aria-label="EGS Pillay Group of Institutions — home">
            <Image
              src="/egs-pillay-group-logo-flat-dark.svg"
              alt="EGS Pillay Group of Institutions"
              width={884}
              height={232}
              className="institution-logo"
              priority
            />
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {primaryNav.slice(0, 2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={path === link.href ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
            <details ref={dropdown} className="explore-menu">
              <summary>
                Explore <ChevronDown size={14} aria-hidden="true" />
              </summary>
              <div className="dropdown">
                {exploreNav.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => {
                      if (dropdown.current) dropdown.current.open = false;
                    }}
                    aria-current={path === link.href ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </details>
            {primaryNav.slice(2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={path === link.href ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link href="/participate#registration" className="header-cta">
            Participate <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
          <button
            ref={menuButton}
            className="menu-button"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && <MobileMenu close={() => setOpen(false)} />}
      </Container>
    </header>
  );
}
