import React from 'react';
import type { SimulationResult, ScenarioPreset } from '../types/physics';

interface HeroVisualProps {
  result: SimulationResult;
  selectedScenario: ScenarioPreset;
}

export const HeroVisual: React.FC<HeroVisualProps> = ({ result, selectedScenario }) => {
  const isBleve = selectedScenario.type === 'BLEVE';
  const zones = isBleve ? result.thermalZones : result.overpressureZones;
  const sorted = [...zones].reverse();

  return (
    <div className="lp-visual" aria-hidden="true">
      <div className="lp-visual-scan" />
      <div className="lp-visual-rings">
        {sorted.map((zone, i) => (
          <div
            key={zone.zone}
            className="lp-ring"
            style={{
              ['--ring-color' as string]: zone.color,
              ['--ring-size' as string]: `${38 + i * 14}%`,
              ['--ring-delay' as string]: `${i * 0.55}s`,
            }}
          />
        ))}
      </div>
      <div className="lp-visual-core">
        <span className="lp-core-pulse" />
        <span className="lp-core-dot" />
      </div>

      <div className="lp-visual-hud lp-hud-tl">
        <span className="lp-hud-label">Engine</span>
        <span className="lp-hud-value lp-hud-live">LIVE</span>
      </div>
      <div className="lp-visual-hud lp-hud-tr">
        <span className="lp-hud-label">Mode</span>
        <span className="lp-hud-value">{isBleve ? 'BLEVE' : 'VCE'}</span>
      </div>
      <div className="lp-visual-hud lp-hud-bl">
        <span className="lp-hud-label">TNT eq.</span>
        <span className="lp-hud-value">{result.tntMass.toLocaleString()} kg</span>
      </div>
      <div className="lp-visual-hud lp-hud-br">
        <span className="lp-hud-label">Zones</span>
        <span className="lp-hud-value">{zones.length} active</span>
      </div>
    </div>
  );
};
