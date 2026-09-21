'use client';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/components/motion/preferences';
import type { ReactNode } from 'react';
export function ArtworkEntrance({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className="artwork-frame"
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      whileHover={reduced ? undefined : { y: -3 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
}
