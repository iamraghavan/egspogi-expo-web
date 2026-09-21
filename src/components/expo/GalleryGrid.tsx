'use client';
import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/components/motion/preferences';
import type { GalleryItem } from '@/lib/cms/public';
export function GalleryGrid({
  preview = false,
  gallery,
}: {
  preview?: boolean;
  gallery: GalleryItem[];
}) {
  const [filter, setFilter] = useState('All');
  const reduced = useReducedMotion();
  const items = (preview ? gallery.slice(0, 4) : gallery).filter(
    (item) => filter === 'All' || item.category === filter,
  );
  return (
    <>
      {!preview && (
        <div className="gallery-filters" aria-label="Filter gallery">
          {['All', 'Projects', 'Events', 'Behind the scenes', 'Awards'].map((value) => (
            <button key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>
              {value}
            </button>
          ))}
        </div>
      )}
      <p className="gallery-note" role="status">
        {preview
          ? 'Projects, people and moments from the expo.'
          : `${items.length} images · Concept illustrations are labelled individually.`}
      </p>
      <div className={`gallery-grid ${preview ? 'gallery-preview' : ''}`}>
        {items.map((item) => (
          <motion.figure
            key={item.title}
            layout={!reduced}
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={720}
              height={480}
              sizes="(max-width: 640px) 100vw, 50vw"
            />
            <figcaption>
              {item.title}
              <span>
                {item.category}
                {item.illustration ? ' · Illustration' : ''}
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </>
  );
}
