'use client';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/components/motion/preferences';
export type ExperimentRenderer = {
  draw: (angle: number, time: number) => void;
  resize: () => void;
  dispose: () => void;
};
export type CreateRenderer = (canvas: HTMLCanvasElement) => ExperimentRenderer;
export function WebGLExperiment({
  create,
  kind,
}: {
  create: CreateRenderer;
  kind: 'orbit' | 'aero';
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const state = useRef({ angle: 20, playing: false, reduced: true });
  const redraw = useRef<(() => void) | null>(null);
  const [angle, setAngle] = useState(20);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    state.current = { angle, playing, reduced };
    redraw.current?.();
  }, [angle, playing, reduced]);
  useEffect(() => {
    const target = canvas.current;
    if (!target) return;
    let renderer: ExperimentRenderer;
    try {
      renderer = create(target);
    } catch (error) {
      console.warn('Science experiment graphics initialization failed:', error);
      queueMicrotask(() => setFailed(true));
      return;
    }
    let frame = 0,
      time = 0,
      previous = 0,
      visible = true;
    const draw = (now: number) => {
      frame = 0;
      const active = state.current.playing && !state.current.reduced && visible && !document.hidden;
      if (active) time += previous ? Math.min((now - previous) / 1000, 0.05) : 0;
      previous = active ? now : 0;
      renderer.draw(state.current.angle, time);
      if (active) frame = requestAnimationFrame(draw);
    };
    const requestDraw = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    redraw.current = requestDraw;
    const resize = new ResizeObserver(() => {
      renderer.resize();
      requestDraw();
    });
    resize.observe(target);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      previous = 0;
      requestDraw();
    });
    observer.observe(target);
    document.addEventListener('visibilitychange', requestDraw);
    const lost = (event: Event) => {
      event.preventDefault();
      cancelAnimationFrame(frame);
      frame = 0;
      setFailed(true);
    };
    target.addEventListener('webglcontextlost', lost);
    renderer.resize();
    requestDraw();
    return () => {
      cancelAnimationFrame(frame);
      redraw.current = null;
      observer.disconnect();
      resize.disconnect();
      document.removeEventListener('visibilitychange', requestDraw);
      target.removeEventListener('webglcontextlost', lost);
      renderer.dispose();
    };
  }, [create]);
  const label = kind === 'orbit' ? 'Orbital inclination' : 'Wing angle';
  return (
    <div>
      <div className="webgl-stage">
        <canvas
          ref={canvas}
          role="img"
          aria-label={
            kind === 'orbit'
              ? `Geometric satellite orbit at ${angle} degrees inclination`
              : `Illustrative airflow around a wing at ${angle} degrees`
          }
        />
        {failed && (
          <p className="webgl-fallback" role="status">
            The interactive view needs WebGL graphics support. Try a browser with hardware
            acceleration enabled.
          </p>
        )}
      </div>
      <div className="lab-controls">
        <label htmlFor={`${kind}-angle`}>
          {label} <output>{angle}°</output>
          <input
            id={`${kind}-angle`}
            type="range"
            min={kind === 'orbit' ? 0 : -25}
            max={kind === 'orbit' ? 80 : 25}
            value={angle}
            disabled={failed}
            onChange={(e) => setAngle(Number(e.target.value))}
          />
        </label>
        <div className="lab-actions">
          <button
            className="lab-button primary"
            disabled={reduced || failed}
            onClick={() => setPlaying(!playing)}
          >
            {playing && !reduced ? 'Pause experiment' : 'Play experiment'}
          </button>
          <button
            className="lab-button"
            disabled={failed}
            onClick={() => {
              setPlaying(false);
              setAngle(20);
            }}
          >
            Reset angle
          </button>
        </div>
      </div>
      <p className="lab-status" role="status">
        {reduced
          ? 'Reduced motion is on. Use the angle slider to explore still views.'
          : playing
            ? 'Experiment running. It pauses automatically outside the visible page.'
            : 'Paused. Adjust the angle or press play.'}
      </p>
      <p className="small-note">
        {kind === 'orbit'
          ? 'Inclination changes the tilt of an orbit relative to a reference plane. Distances, sizes and speed here are illustrative.'
          : 'A wing changes the direction of air around it. These flow lines are an illustration, not a calculation of lift or stall.'}
      </p>
    </div>
  );
}
