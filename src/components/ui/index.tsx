import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('container', className)}>{children}</div>;
}
export function Button({
  children,
  href,
  variant = 'primary',
  className,
}: {
  children: ReactNode;
  href: string;
  variant?: 'primary' | 'light' | 'outline';
  className?: string;
}) {
  return (
    <Link className={cn('button', `button-${variant}`, className)} href={href}>
      {children}
      <ArrowUpRight size={18} aria-hidden="true" />
    </Link>
  );
}
export function SectionHeader({
  label,
  title,
  description,
  href,
  linkText = 'Explore more',
}: {
  label?: string;
  title: string;
  description?: string;
  href?: string;
  linkText?: string;
}) {
  return (
    <div className="section-header">
      <div>
        {label && <p className="eyebrow">{label}</p>}
        <h2>{title}</h2>
        {description && <p className="section-description">{description}</p>}
      </div>
      {href && (
        <Link className="text-link" href={href}>
          {linkText}
          <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol>
        <li>
          <Link href="/">Home</Link>
        </li>
        {items.map((item) => (
          <li key={item.label}>
            {item.href ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
export function PageIntro({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-intro">
      <Container>
        <Breadcrumbs items={[{ label }]} />
        <p className="eyebrow">{label}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </Container>
    </div>
  );
}
export function PreviewNote({
  children = 'Planning preview: dates, programme and participation details are sample information and await organiser confirmation.',
}: {
  children?: ReactNode;
}) {
  return <p className="preview-note">{children}</p>;
}
