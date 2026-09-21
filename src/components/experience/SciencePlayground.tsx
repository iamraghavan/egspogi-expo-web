'use client';
import dynamic from 'next/dynamic';
import { Component, type ReactNode, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Radio, Orbit, Wind, ArrowUpRight } from 'lucide-react';
import { useReducedMotion } from '@/components/motion/preferences';
const loading = () => (
  <p className="lab-loading" role="status">
    Preparing your experiment…
  </p>
);
const SignalLab = dynamic(() => import('./SignalLab'), { ssr: false, loading });
const OrbitLab = dynamic(() => import('./OrbitLab'), { ssr: false, loading });
const AeroLab = dynamic(() => import('./AeroLab'), { ssr: false, loading });
class ExperimentBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <p role="status" className="lab-loading">
        This experiment could not load. Reload the page to try again. You can still explore all expo
        information.
      </p>
    ) : (
      this.props.children
    );
  }
}
const experiments = [
  {
    title: 'Send a signal',
    category: 'Satellite technology',
    copy: 'Move the ground station and follow a message from Earth to a satellite.',
    icon: Radio,
    color: 'teal',
  },
  {
    title: 'Explore an orbit',
    category: 'Space exploration',
    copy: 'Adjust the orbital plane and see a satellite travel around a geometric planet.',
    icon: Orbit,
    color: 'yellow',
  },
  {
    title: 'Inside the airflow',
    category: 'Aerodynamics',
    copy: 'Change a wing’s angle and watch illustrative flow lines pass around it.',
    icon: Wind,
    color: 'coral',
  },
];
export function SciencePlayground() {
  const [selected, setSelected] = useState<number | null>(null);
  const reduced = useReducedMotion();
  return (
    <div className="playground">
      <div className="experiment-choices">
        {experiments.map((item, index) => (
          <button
            key={item.title}
            className={`experiment-choice ${item.color}`}
            aria-pressed={selected === index}
            aria-controls="experiment-panel"
            onClick={() => setSelected(index)}
          >
            <span className="experiment-number">
              0{index + 1} / {item.category}
            </span>
            <item.icon size={40} strokeWidth={1.4} aria-hidden="true" />
            <strong>{item.title}</strong>
            <span>{item.copy}</span>
            <span className="experiment-open">
              {selected === index ? 'Experiment open' : 'Open experiment'}{' '}
              <ArrowUpRight size={18} aria-hidden="true" />
            </span>
          </button>
        ))}
      </div>
      <div id="experiment-panel">
        <AnimatePresence mode="wait" initial={false}>
          {selected !== null && (
            <motion.section
              key={selected}
              className="experiment-panel"
              aria-label={experiments[selected].title}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.2 }}
            >
              <div className="lab-heading">
                <div>
                  <p className="eyebrow">Try it yourself</p>
                  <h2>{experiments[selected].title}</h2>
                </div>
                <button className="lab-button" onClick={() => setSelected(null)}>
                  Close experiment
                </button>
              </div>
              <ExperimentBoundary>
                {selected === 0 ? <SignalLab /> : selected === 1 ? <OrbitLab /> : <AeroLab />}
              </ExperimentBoundary>
            </motion.section>
          )}
        </AnimatePresence>
        {selected === null && (
          <p className="lab-invitation">
            Choose an experiment above. Each one loads on demand and starts still.
          </p>
        )}
      </div>
    </div>
  );
}
