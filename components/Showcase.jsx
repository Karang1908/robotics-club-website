'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronIcon } from './Icons';

export default function Showcase({ robots, label, emptyText }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [manual, setManual] = useState(false);
  const region = useRef(null);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(media.matches);
    update(); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (robots.length < 2 || paused || reduceMotion) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) { setIndex((current) => (current + 1) % robots.length); setManual(false); }
    }, 6500);
    return () => window.clearInterval(timer);
  }, [robots.length, paused, reduceMotion]);

  if (!robots.length) return <div className="showcase showcase-empty"><p>{emptyText}</p></div>;
  const current = robots[index % robots.length];
  const select = (next) => { setIndex((next + robots.length) % robots.length); setManual(true); };

  return <section ref={region} className="showcase" aria-label="Lab robot showcase" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={(event) => { if (!region.current?.contains(event.relatedTarget)) setPaused(false); }}>
    <div className="showcase-image-stack">
      {robots.map((robot, i) => <div key={robot.id} className={`showcase-image${i === index ? ' selected' : ''}`} style={{ backgroundImage: robot.image ? `url("${robot.image.replaceAll('"', '%22')}")` : undefined }} role="img" aria-label={i === index ? robot.imageAlt : undefined} aria-hidden={i !== index} />)}
    </div>
    <div className="showcase-wash" />
    <div className="showcase-top"><span className="showcase-label"><span className="live-square" /> {label}</span><span className="showcase-count">{String(index + 1).padStart(2, '0')} / {String(robots.length).padStart(2, '0')}</span></div>
    <div className="showcase-bottom">
      <div className="showcase-info" aria-live={manual ? 'polite' : 'off'}>
        <span className="showcase-type">{current.type}</span>
        <h2>{current.title}</h2>
        <p>{current.description}</p>
        {current.imageNote && <small>{current.imageNote}</small>}
      </div>
      <div className="showcase-controls">
        <div className="showcase-dots" aria-label="Choose a robot">{robots.map((robot, i) => <button key={robot.id} type="button" onClick={() => select(i)} className={i === index ? 'selected' : ''} aria-label={`Show ${robot.title}`} aria-current={i === index ? 'true' : undefined} />)}</div>
        <div className="showcase-arrows"><button type="button" onClick={() => select(index - 1)} aria-label="Previous robot"><ChevronIcon left /></button><button type="button" onClick={() => select(index + 1)} aria-label="Next robot"><ChevronIcon /></button></div>
      </div>
    </div>
  </section>;
}
