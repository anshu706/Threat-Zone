import React, { useEffect } from 'react';
import { Menu, X, LayoutDashboard } from 'lucide-react';

interface SiteNavbarProps {
  onLaunchDashboard?: () => void;
  onOpenMenu: () => void;
  isMenuOpen: boolean;
}

const NAV_LINKS = [
  { id: 'scenarios', label: 'Scenarios' },
  { id: 'map', label: 'World Radar' },
  { id: 'simulator', label: 'Simulator' },
  { id: 'results', label: 'Results' },
  { id: 'charts', label: 'Hazard Curves' },
  { id: 'safety', label: 'Safety' },
];

export const SiteNavbar: React.FC<SiteNavbarProps> = ({
  onLaunchDashboard,
  onOpenMenu,
  isMenuOpen,
}) => {
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 80;
      if (isScrolled) {
        document.body.classList.add('page-scrolled');
      } else {
        document.body.classList.remove('page-scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="dh-header">
      <div className="dh-header__inner">
        {/* Left: Editorial Intro Blurb (DreamHouse Signature) */}
        <div className="dh-header__intro">
          <p>
            THREAT ZONE IS AN INDUSTRIAL CONSEQUENCE & BLAST PHYSICS PLATFORM SAFEGUARDING 10 CRITICAL INDIAN REFINERIES.
          </p>
        </div>

        {/* Center: Brand Wordmark with Live Status Dot */}
        <button
          type="button"
          className="dh-header__logoWrap"
          onClick={() => scrollTo('home')}
          aria-label="Threat Zone Home"
        >
          THREAT ZONE
          <span className="dh-header__logo-badge">
            <span className="dh-header__live-dot" />
            LIVE PHYSICS
          </span>
        </button>

        {/* Right: Nav Links + Menu Drawer Toggle */}
        <div className="dh-header__menuWrap">
          <ul className="dh-header__menuList">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <button type="button" onClick={() => scrollTo(link.id)}>
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          {onLaunchDashboard && (
            <button
              type="button"
              className="dh-btn-pill-ghost"
              style={{ padding: '0.35rem 0.85rem', fontSize: '0.72rem' }}
              onClick={onLaunchDashboard}
              title="Open 3-panel industrial dashboard"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
          )}

          <button
            type="button"
            className="dh-burger-btn"
            onClick={onOpenMenu}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <span>{isMenuOpen ? 'Close' : 'Menu'}</span>
            {isMenuOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
