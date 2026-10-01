import React, { useEffect, useState } from 'react';

const SECTIONS = [
  { id: 'configure', num: '001', label: 'Setup' },
  { id: 'results', num: '002', label: 'Results' },
  { id: 'analytics', num: '003', label: 'Curves' },
  { id: 'comparisons', num: '004', label: 'Compare' },
  { id: 'advisories', num: '005', label: 'Safety' },
] as const;

export const SectionNav: React.FC = () => {
  const [active, setActive] = useState<string>('configure');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: '-15% 0px -55% 0px', threshold: 0.1 }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className="ca-nav" aria-label="Sections">
      {SECTIONS.map(({ id, num, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => scrollTo(id)}
          className={`ca-nav-item ${active === id ? 'ca-nav-item-active' : ''}`}
          aria-current={active === id ? 'true' : undefined}
        >
          <span className="ca-nav-num">{num}</span>
          {label}
        </button>
      ))}
      <span className="ca-nav-hint">Map pinned ←</span>
    </nav>
  );
};
