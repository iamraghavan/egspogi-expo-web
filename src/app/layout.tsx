import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { event } from '@/data/event';
import './globals.css';
import '@/styles/operations.css';
import '@/styles/motion.css';
import { SiteMotion } from '@/components/motion/SiteMotion';
import { getEvent } from '@/lib/cms/public';
import { LiveNotices } from '@/components/expo/LiveNotices';
export const dynamic = 'force-dynamic';
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const space = Space_Grotesk({ subsets: ['latin'], variable: '--font-space', display: 'swap' });
export const metadata: Metadata = {
  metadataBase: new URL(event.siteUrl),
  title: {
    default: 'Science Expo 2026 | EGS Pillay Group of Institutions',
    template: '%s | Science Expo 2026',
  },
  description: event.description,
  openGraph: {
    title: event.name,
    description: event.description,
    type: 'website',
    locale: 'en_IN',
    siteName: event.name,
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: event.name,
    description: event.description,
    images: ['/opengraph-image'],
  },
  robots: { index: true, follow: true },
};
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getEvent();
  return (
    <html lang="en">
      <body data-preview={settings.previewMode} className={`${inter.variable} ${space.variable}`}>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <Header />
        <SiteMotion />
        <LiveNotices />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
