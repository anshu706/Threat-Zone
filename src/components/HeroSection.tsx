import React, { useRef } from 'react';
import { ArrowDown, ChevronRight, Flame, Wind, LayoutDashboard } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import type { IndianRegion, SimulationResult, ScenarioPreset } from '../types/physics';
import { AnimatedText } from './AnimatedText';
import { HeroVisual } from './HeroVisual';
import { LandingFeatures } from './LandingFeatures';

interface HeroSectionProps {
  selectedRegion: IndianRegion;
  selectedScenario: ScenarioPreset;
  result: SimulationResult;
  onGetStarted: () => void;
  onLaunchDashboard?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedRegion,
  selectedScenario,
  result,
  onGetStarted,
  onLaunchDashboard,
}) => {
  const heroRef = useRef<HTMLElement>(null);

  const maxRadius =
    selectedScenario.type === 'BLEVE'
      ? Math.max(...result.thermalZones.map((z) => z.radius), 0)
      : Math.max(...result.overpressureZones.map((z) => z.radius), 0);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.lp-aurora', { opacity: 0, scale: 0.85, duration: 1.4, stagger: 0.2 })
        .from('.lp-badge', { y: 20, opacity: 0, duration: 0.6 }, '-=0.8')
        .from('.lp-hero-title-wrap', { y: 36, opacity: 0, duration: 0.85 }, '-=0.5')
        .from('.lp-hero-lead', { y: 24, opacity: 0, duration: 0.7 }, '-=0.55')
        .from('.lp-hero-actions', { y: 20, opacity: 0, duration: 0.6 }, '-=0.45')
        .from('.lp-hero-tags', { y: 16, opacity: 0, duration: 0.5 }, '-=0.35')
        .from('.lp-visual', { scale: 0.88, opacity: 0, duration: 1, ease: 'expo.out' }, '-=0.9')
        .from('.lp-stat-pill', { y: 12, opacity: 0, stagger: 0.08, duration: 0.45 }, '-=0.5')
        .from('.lp-features', { y: 40, opacity: 0, duration: 0.8 }, '-=0.3');
    },
    { scope: heroRef }
  );

  return (
    <section id="home" className="lp-hero" ref={heroRef}>
      <div className="lp-hero-bg" aria-hidden="true">
        <div className="lp-aurora lp-aurora-blast" />
        <div className="lp-aurora lp-aurora-thermal" />
        <div className="lp-hero-grid-lines" />
        <div className="lp-hero-noise" />
        <div className="lp-hero-vignette" />
      </div>

      <div className="tz-container lp-hero-main">
        <div className="lp-hero-copy">
          <div className="lp-badge">
            <span className="lp-badge-dot" />
            India · Oil & Gas · Petrochemical
          </div>

          <div className="lp-hero-title-wrap">
            <AnimatedText
              as="h1"
              className="lp-hero-title"
              text="Threat Zone"
              by="chars"
              stagger={0.04}
            />
            <p className="lp-hero-tagline">
              See <span className="lp-gradient-blast">blast</span> &{' '}
              <span className="lp-gradient-thermal">fire</span> before they happen
            </p>
          </div>

          <p className="lp-hero-lead">
            A cinematic industrial safety platform for Indian refineries. Model VCE explosions and
            BLEVE fireballs on a live world map — with clear numbers, charts, and actionable
            guidance.
          </p>

          <div className="lp-hero-actions">
            <button type="button" className="lp-btn-primary" onClick={onGetStarted}>
              Launch simulator
              <ChevronRight className="w-4 h-4" />
            </button>
            {onLaunchDashboard && (
              <button
                type="button"
                id="hero-launch-dashboard"
                className="lp-btn-ghost lp-btn-ghost-accent"
                onClick={onLaunchDashboard}
              >
                <LayoutDashboard className="w-4 h-4" />
                Open dashboard
              </button>
            )}
            <button
              type="button"
              className="lp-btn-ghost"
              onClick={() => document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View live map
            </button>
          </div>

          <div className="lp-hero-tags">
            <span className="lp-tag">
              <Flame className="w-3 h-3" /> BLEVE modeling
            </span>
            <span className="lp-tag">
              <Wind className="w-3 h-3" /> VCE blast zones
            </span>
            <span className="lp-tag">10 India sites</span>
          </div>
        </div>

        <div className="lp-hero-visual-wrap">
          <HeroVisual result={result} selectedScenario={selectedScenario} />
        </div>
      </div>

      <div className="tz-container lp-hero-stats">
        <div className="lp-stat-pill">
          <span className="lp-stat-num">{selectedRegion.name}</span>
          <span className="lp-stat-lbl">Active facility · {selectedRegion.state}</span>
        </div>
        <div className="lp-stat-pill">
          <span className="lp-stat-num">{selectedScenario.type}</span>
          <span className="lp-stat-lbl">{selectedScenario.name}</span>
        </div>
        <div className="lp-stat-pill">
          <span className="lp-stat-num">{maxRadius.toFixed(0)} m</span>
          <span className="lp-stat-lbl">Safe boundary distance</span>
        </div>
        <div className="lp-stat-pill">
          <span className="lp-stat-num">{result.tntMass.toLocaleString()}</span>
          <span className="lp-stat-lbl">kg TNT equivalent</span>
        </div>
        <div className="lp-stat-pill">
          <span className="lp-stat-num">{selectedRegion.workforceLive.toLocaleString()}</span>
          <span className="lp-stat-lbl">On shift · live</span>
        </div>
      </div>

      <div className="tz-container">
        <LandingFeatures onExplore={onGetStarted} />
      </div>

      <button
        type="button"
        className="lp-scroll-hint"
        onClick={onGetStarted}
        aria-label="Scroll to explore"
      >
        <span>Scroll</span>
        <ArrowDown className="w-4 h-4" />
      </button>
    </section>
  );
};
