import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionProps {
  title: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  badge?: string;
  children: React.ReactNode;
}

export const Accordion: React.FC<AccordionProps> = ({
  title,
  icon,
  defaultOpen = true,
  badge,
  children,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`accordion ${open ? 'accordion-open' : ''}`}>
      <button
        type="button"
        className="accordion-trigger"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <div className="accordion-trigger-left">
          {icon && <span className="accordion-icon">{icon}</span>}
          <span className="accordion-title">{title}</span>
          {badge && <span className="accordion-badge">{badge}</span>}
        </div>
        <ChevronDown className={`accordion-chevron w-4 h-4 ${open ? 'accordion-chevron-open' : ''}`} />
      </button>
      <div className="accordion-content" aria-hidden={!open}>
        <div className="accordion-body">{children}</div>
      </div>
    </div>
  );
};
