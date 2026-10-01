import React from 'react';

interface PageSectionProps {
  id: string;
  num: string;
  title: string;
  lead?: React.ReactNode;
  children: React.ReactNode;
  variant?: 'default' | 'muted' | 'dark-band';
}

export const PageSection: React.FC<PageSectionProps> = ({
  id,
  num,
  title,
  lead,
  children,
  variant = 'default',
}) => (
  <section id={id} className={`tz-section tz-section-${variant}`}>
    <div className="tz-container">
      <header className="tz-section-header">
        <p className="ca-section-label">{num}</p>
        <h2 className="tz-section-title tz-section-heading">{title}</h2>
        {lead && <p className="tz-section-lead">{lead}</p>}
      </header>
      {children}
    </div>
  </section>
);
