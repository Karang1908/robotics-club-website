'use client';

import { useEffect, useState } from 'react';
import { ChevronIcon } from './Icons';

const INTERVAL_MS = 6500;

export default function Showcase({ robots, label, emptyText }) {
  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const playing = robots.length > 1 && !userPaused && !reduceMotion;
  const autoAdvance = playing && !hovering && !focusWithin;

  useEffect(() => {
    if (!autoAdvance) return undefined;
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex((current) => (current + 1) % robots.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [autoAdvance, robots.length]);

  if (!robots.length) return <div className="showcase showcase-empty"><p>{emptyText}</p></div>;

  const current = robots[index % robots.length];
  const select = (next) => setIndex((next + robots.length) % robots.length);
  const total = robots.length;

  return <section
    className="showcase"
    aria-roledescription="carousel"
    aria-label={label}
    onMouseEnter={() => setHovering(true)}
    onMouseLeave={() => setHovering(false)}
    onFocus={() => setFocusWithin(true)}
    onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocusWithin(false); }}
  >
    <div className="showcase-media">
      {robots.map((robot, i) => robot.image
        ? <img
            key={robot.id}
            className={`showcase-image${i === index ? ' selected' : ''}`}
            src={robot.image}
            alt={i === index ? robot.imageAlt : ''}
            aria-hidden={i !== index}
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchPriority={i === 0 ? 'high' : undefined}
            decoding="async"
          />
        : null)}
      {current.imageNote && <small className="image-note">{current.imageNote}</small>}
    </div>
    <div className="showcase-panel">
      <div className="showcase-top">
        <span className="eyebrow">{label}</span>
        <span className="showcase-count" aria-hidden="true">{index + 1} / {total}</span>
      </div>
      <div className="showcase-info" aria-live={playing ? 'off' : 'polite'} aria-atomic="true">
        <span className="showcase-type">{current.type}</span>
        <h2>{current.title}</h2>
        <p>{current.description}</p>
      </div>
      <div className="showcase-controls">
        {total > 1 && <div className="showcase-dots" role="group" aria-label="Choose a robot">
          {robots.map((robot, i) => <button key={robot.id} type="button" onClick={() => select(i)} className={i === index ? 'selected' : ''} aria-label={`Show ${robot.title}`} aria-current={i === index ? 'true' : undefined} />)}
        </div>}
        {total > 1 && <div className="showcase-arrows">
          {!reduceMotion && <button type="button" className="showcase-toggle" onClick={() => setUserPaused((value) => !value)} aria-pressed={userPaused}>{userPaused ? 'Play' : 'Pause'}</button>}
          <button type="button" onClick={() => select(index - 1)} aria-label="Previous robot"><ChevronIcon left /></button>
          <button type="button" onClick={() => select(index + 1)} aria-label="Next robot"><ChevronIcon /></button>
        </div>}
      </div>
    </div>
  </section>;
}
