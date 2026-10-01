import React from 'react';
import type { SimulationResult, ScenarioPreset } from '../../types/physics';
import { getOverpressureAtDistance } from '../../utils/physics';

interface KpiBannerProps {
  result: SimulationResult;
  selectedScenario: ScenarioPreset;
}

export const KpiBanner: React.FC<KpiBannerProps> = ({ result, selectedScenario }) => {
  const isBleve = selectedScenario.type === 'BLEVE';
  const maxRadius = isBleve
    ? Math.max(...result.thermalZones.map((z) => z.radius), 0)
    : Math.max(...result.overpressureZones.map((z) => z.radius), 0);
  const peakPsO = getOverpressureAtDistance(1, result.tntMass);
  const peakPsi = peakPsO * 14.5038;

  return (
    <div className="ids-kpi-grid">
      <div className="ids-kpi">
        <span className="ids-kpi-label">TNT equivalent</span>
        <span className="ids-kpi-value ids-kpi-value-accent">
          {result.tntTons.toFixed(3)}
          <span className="ids-kpi-unit"> tons</span>
        </span>
      </div>
      <div className="ids-kpi">
        <span className="ids-kpi-label">Peak P<sub>so</sub></span>
        <span className="ids-kpi-value">
          {peakPsi.toFixed(1)}
          <span className="ids-kpi-unit"> psi</span>
        </span>
      </div>
      <div className="ids-kpi">
        <span className="ids-kpi-label">Safe distance</span>
        <span className="ids-kpi-value">
          {maxRadius >= 1000 ? `${(maxRadius / 1000).toFixed(2)} km` : `${maxRadius.toFixed(0)} m`}
        </span>
      </div>
      <div className="ids-kpi">
        <span className="ids-kpi-label">Release energy</span>
        <span className="ids-kpi-value">
          {result.blastEnergy.toLocaleString()}
          <span className="ids-kpi-unit"> MJ</span>
        </span>
      </div>
    </div>
  );
};
