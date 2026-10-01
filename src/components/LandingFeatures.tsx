import React from 'react';
import { Globe, Zap, BarChart3, ShieldCheck, ArrowRight } from 'lucide-react';

const FEATURES = [
  {
    icon: Globe,
    title: 'World map, India focus',
    desc: 'Satellite Earth view with 10 refineries. Hover any site for weather and live workforce.',
    accent: 'cyan',
  },
  {
    icon: Zap,
    title: 'Real physics engine',
    desc: 'VCE blast and BLEVE fireball modeling with TNT equivalent and hazard zones.',
    accent: 'orange',
  },
  {
    icon: BarChart3,
    title: 'Charts & comparisons',
    desc: 'Distance decay curves plus temperature and humidity sensitivity analysis.',
    accent: 'violet',
  },
  {
    icon: ShieldCheck,
    title: 'Plain safety guidance',
    desc: 'Equipment fixes and operator steps written for teams, not just engineers.',
    accent: 'green',
  },
] as const;

interface LandingFeaturesProps {
  onExplore: () => void;
}

export const LandingFeatures: React.FC<LandingFeaturesProps> = ({ onExplore }) => (
  <div className="lp-features">
    <div className="lp-features-head">
      <p className="lp-features-eyebrow">Platform capabilities</p>
      <h2 className="lp-features-title">Everything you need to model industrial risk</h2>
    </div>
    <div className="lp-features-grid">
      {FEATURES.map(({ icon: Icon, title, desc, accent }) => (
        <article key={title} className={`lp-feature-card lp-feature-${accent}`}>
          <div className="lp-feature-icon-wrap">
            <Icon className="lp-feature-icon" />
          </div>
          <h3 className="lp-feature-title">{title}</h3>
          <p className="lp-feature-desc">{desc}</p>
        </article>
      ))}
    </div>
    <button type="button" className="lp-features-cta" onClick={onExplore}>
      Explore the simulator
      <ArrowRight className="w-4 h-4" />
    </button>
  </div>
);
