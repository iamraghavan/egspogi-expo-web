'use client';
import { useEffect, useRef, useState } from 'react';
import {
  animate,
  createTimer,
  createTimeline,
  createAnimatable,
  createDraggable,
  createScope,
  onScroll,
  svg,
  utils,
  easings,
  waapi,
} from 'animejs';
import { useReducedMotion } from '@/components/motion/preferences';
export default function SignalLab() {
  const root = useRef<HTMLDivElement>(null);
  const controls = useRef<{
    send: () => void;
    move: (value: number) => void;
    reset: () => void;
  } | null>(null);
  const [position, setPosition] = useState(0);
  const [status, setStatus] = useState('Ready to transmit');
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!root.current) return;
    const host = root.current;
    const scope = createScope({ root: host }).add(() => {
      const transmitter = host.querySelector<HTMLElement>('.signal-transmitter')!;
      const receiver = host.querySelector<HTMLElement>('.signal-receiver')!;
      const gauge = host.querySelector<HTMLElement>('.signal-gauge span')!;
      const path = host.querySelector<SVGPathElement>('.signal-path')!;
      const movable = createAnimatable(transmitter, {
        x: reduced ? 0 : 250,
        ease: easings.eases.out(3),
      });
      const drawable = svg.createDrawable(path);
      const timeline = createTimeline({
        autoplay: false,
        defaults: { ease: easings.eases.inOut(2) },
        onComplete: () => setStatus('Message received — transmission complete'),
      })
        .add(drawable, { draw: ['0 0', '0 1'], duration: 1700 })
        .add(receiver, { scale: [1, 1.12, 1], duration: 400 });
      const timer = createTimer({
        duration: 2100,
        autoplay: false,
        onUpdate: (self) => {
          gauge.style.width = `${self.progress * 100}%`;
        },
      });
      const draggable = createDraggable(transmitter, {
        x: true,
        y: false,
        container: [0, 70, 0, -70],
        releaseEase: easings.eases.out(3),
        onDrag: (self) => setPosition(Math.round(utils.clamp(self.x, -70, 70))),
      });
      if (reduced) draggable.disable();
      if (!reduced)
        animate('.signal-stage-label', {
          opacity: [0.5, 1],
          duration: 500,
          autoplay: onScroll({ target: host, enter: 'bottom top', repeat: false }),
        });
      let pulse: ReturnType<typeof waapi.animate> | undefined;
      controls.current = {
        move(value) {
          const next = utils.clamp(value, -70, 70);
          movable.x(next);
          setPosition(next);
        },
        send() {
          pulse?.revert();
          if (reduced) {
            path.style.strokeDasharray = 'none';
            gauge.style.width = '100%';
            setStatus('Message received — transmission complete');
            return;
          }
          setStatus('Transmitting to the satellite…');
          timeline.restart();
          timer.restart();
          pulse = waapi.animate(transmitter, {
            opacity: [1, 0.55, 1],
            duration: 400,
            iterations: 2,
          });
        },
        reset() {
          timeline.pause();
          timer.pause();
          timeline.seek(0);
          timer.seek(0);
          pulse?.revert();
          movable.x(0);
          gauge.style.width = '0%';
          setPosition(0);
          setStatus('Ready to transmit');
        },
      };
      const pause = () => {
        if (document.hidden) {
          timeline.pause();
          timer.pause();
          setStatus('Transmission paused. Send again to restart.');
        }
      };
      document.addEventListener('visibilitychange', pause);
      const observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) {
          timeline.pause();
          timer.pause();
        }
      });
      observer.observe(host);
      return () => {
        observer.disconnect();
        document.removeEventListener('visibilitychange', pause);
        pulse?.revert();
      };
    });
    return () => {
      controls.current = null;
      scope.revert();
    };
  }, [reduced]);
  return (
    <div ref={root}>
      <div className="signal-stage">
        <span className="signal-stage-label">EARTH → SATELLITE</span>
        <svg viewBox="0 0 600 240" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M110 205 Q150 40 470 55"
            fill="none"
            stroke="#294f83"
            strokeWidth="2"
            strokeDasharray="5 7"
          />
          <path
            className="signal-path"
            d="M110 205 Q150 40 470 55"
            fill="none"
            stroke="#F7B817"
            strokeWidth="4"
          />
        </svg>
        <div className="signal-receiver" aria-hidden="true">
          ▥ ◆ ▥
        </div>
        <div className="signal-transmitter" aria-hidden="true">
          ⌁<span />
        </div>
        <span className="signal-earth" aria-hidden="true" />
      </div>
      <div className="lab-controls">
        <label htmlFor="station-position">
          Ground station position <output>{position}</output>
          <input
            id="station-position"
            type="range"
            min="-70"
            max="70"
            value={position}
            onChange={(e) => controls.current?.move(Number(e.target.value))}
          />
        </label>
        <div className="lab-actions">
          <button className="lab-button primary" onClick={() => controls.current?.send()}>
            Send signal
          </button>
          <button className="lab-button" onClick={() => controls.current?.reset()}>
            Reset signal
          </button>
        </div>
      </div>
      <div className="signal-gauge" aria-hidden="true">
        <span />
      </div>
      <p className="lab-status" role="status">
        {status}
      </p>
      <p className="small-note">
        Drag the ground station or use the slider. A radio message travels between a ground antenna
        and a satellite; the path here is a schematic illustration.
      </p>
    </div>
  );
}
