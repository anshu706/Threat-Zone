import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  ShieldAlert,
  MapPin,
  Zap,
  ChevronRight,
  ChevronLeft,
  Rocket,
  Factory,
  Flame,
  Gauge,
  CheckCircle2,
} from 'lucide-react';
import type { IndianRegion, ScenarioPreset } from '../types/physics';
import { INDIAN_REGIONS } from '../constants/regions';
import { SCENARIOS, HYDROCARBONS } from '../constants/data';

const STORAGE_KEY = 'threatzone_onboarded';

export function getOnboardingComplete(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

interface OnboardingWizardProps {
  selectedRegion: IndianRegion;
  selectedScenario: ScenarioPreset;
  onRegionSelect: (region: IndianRegion) => void;
  onScenarioSelect: (scenario: ScenarioPreset) => void;
  onComplete: () => void;
  onSkip?: () => void;
}

const STEPS = ['Welcome', 'Facility', 'Scenario', 'Launch'];

const scenarioIcons: Record<string, React.ReactNode> = {
  liquid_trapping: <Gauge className="w-5 h-5" />,
  underfilled_tank: <Factory className="w-5 h-5" />,
  vacuum_collapse: <Zap className="w-5 h-5" />,
  rapid_fill_static: <Flame className="w-5 h-5" />,
  pressurized_sphere_bleve: <Flame className="w-5 h-5" />,
};

const typeColors: Record<string, string> = {
  VCE: 'wizard-badge-vce',
  BLEVE: 'wizard-badge-bleve',
  OVERPRESSURE: 'wizard-badge-op',
};

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  selectedRegion,
  selectedScenario,
  onRegionSelect,
  onScenarioSelect,
  onComplete,
  onSkip,
}) => {
  const [step, setStep] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }
    );
  }, [step]);

  const next = () => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else {
      try {
        localStorage.setItem(STORAGE_KEY, 'true');
      } catch {
        /* ignore */
      }
      gsap.to('.wizard-overlay', {
        opacity: 0,
        scale: 1.02,
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete,
      });
    }
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  const handleSkip = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      /* ignore */
    }
    gsap.to('.wizard-overlay', {
      opacity: 0,
      duration: 0.35,
      onComplete: () => onSkip?.() ?? onComplete(),
    });
  };

  const material = HYDROCARBONS.find((h) => h.id === selectedScenario.materialId);

  return (
    <div className="wizard-overlay">
      <div className="wizard-bg-mesh" />
      <div className="wizard-container">
        {/* Progress */}
        <div className="wizard-progress">
          {STEPS.map((label, i) => (
            <div key={label} className={`wizard-step-dot ${i <= step ? 'wizard-step-dot-active' : ''}`}>
              <span className="wizard-step-num">{i + 1}</span>
              <span className="wizard-step-label">{label}</span>
            </div>
          ))}
        </div>

        <div ref={contentRef} className="wizard-content">
          {step === 0 && (
            <div className="wizard-welcome">
              <div className="wizard-logo">
                <ShieldAlert className="w-10 h-10" />
                <div className="wizard-logo-ring" />
              </div>
              <h1 className="wizard-title">The hazard map India doesn&apos;t guess.</h1>
              <p className="wizard-subtitle">Built for industrial safety.</p>
              <p className="wizard-desc">
                Model Vapor Cloud Explosions and BLEVE fireballs across major Indian
                refineries. Committed physics, live zones, safety advisories — not
                reinvented every run.
              </p>
              <div className="wizard-features">
                <div className="wizard-feature">
                  <MapPin className="w-4 h-4" />
                  <span>10 India facilities</span>
                </div>
                <div className="wizard-feature">
                  <Zap className="w-4 h-4" />
                  <span>Live physics engine</span>
                </div>
                <div className="wizard-feature">
                  <Flame className="w-4 h-4" />
                  <span>3D hazard mapping</span>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="wizard-step-panel">
              <h2 className="wizard-step-title">
                <MapPin className="w-5 h-5 text-cyan-400" />
                Select Facility
              </h2>
              <p className="wizard-step-desc">Choose an Indian oil & gas facility as the simulation epicenter.</p>
              <div className="wizard-facility-grid">
                {INDIAN_REGIONS.map((region) => (
                  <button
                    key={region.id}
                    type="button"
                    className={`wizard-facility-card ${selectedRegion.id === region.id ? 'wizard-facility-card-active' : ''}`}
                    onClick={() => onRegionSelect(region)}
                  >
                    <span className="wizard-facility-state">{region.state}</span>
                    <span className="wizard-facility-name">{region.name}</span>
                    <span className="wizard-facility-detail">{region.facility}</span>
                    <span className="wizard-facility-type">{region.type}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="wizard-step-panel">
              <h2 className="wizard-step-title">
                <Flame className="w-5 h-5 text-orange-400" />
                Select Scenario
              </h2>
              <p className="wizard-step-desc">Pick an operational accident type to simulate.</p>
              <div className="wizard-scenario-list">
                {SCENARIOS.map((scenario) => (
                  <button
                    key={scenario.id}
                    type="button"
                    className={`wizard-scenario-card ${selectedScenario.id === scenario.id ? 'wizard-scenario-card-active' : ''}`}
                    onClick={() => onScenarioSelect(scenario)}
                  >
                    <div className="wizard-scenario-icon">
                      {scenarioIcons[scenario.id] ?? <Zap className="w-5 h-5" />}
                    </div>
                    <div className="wizard-scenario-body">
                      <div className="wizard-scenario-header">
                        <span className="wizard-scenario-name">{scenario.name}</span>
                        <span className={`wizard-badge ${typeColors[scenario.type]}`}>{scenario.type}</span>
                      </div>
                      <p className="wizard-scenario-desc">{scenario.description.slice(0, 120)}…</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="wizard-step-panel wizard-launch-panel">
              <div className="wizard-launch-icon">
                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
              </div>
              <h2 className="wizard-step-title">Ready to Launch</h2>
              <p className="wizard-step-desc">Your command center is configured.</p>
              <div className="wizard-summary">
                <div className="wizard-summary-row">
                  <span className="wizard-summary-key">Facility</span>
                  <span className="wizard-summary-val">{selectedRegion.facility}</span>
                </div>
                <div className="wizard-summary-row">
                  <span className="wizard-summary-key">Location</span>
                  <span className="wizard-summary-val">{selectedRegion.name}, {selectedRegion.state}</span>
                </div>
                <div className="wizard-summary-row">
                  <span className="wizard-summary-key">Scenario</span>
                  <span className="wizard-summary-val">{selectedScenario.name}</span>
                </div>
                <div className="wizard-summary-row">
                  <span className="wizard-summary-key">Material</span>
                  <span className="wizard-summary-val">{material?.name ?? '—'}</span>
                </div>
                <div className="wizard-summary-row">
                  <span className="wizard-summary-key">Hazard Type</span>
                  <span className={`wizard-badge ${typeColors[selectedScenario.type]}`}>
                    {selectedScenario.type}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="wizard-actions">
          <button type="button" className="wizard-btn-ghost" onClick={handleSkip}>
            Skip intro
          </button>
          <div className="wizard-actions-right">
            {step > 0 && (
              <button type="button" className="wizard-btn-secondary" onClick={back}>
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
            <button type="button" className="wizard-btn-primary" onClick={next}>
              {step === STEPS.length - 1 ? (
                <>
                  <Rocket className="w-4 h-4" /> Launch Command Center
                </>
              ) : (
                <>
                  Continue <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/** Reset onboarding — useful for "Restart tour" in header */
export function resetOnboarding(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
