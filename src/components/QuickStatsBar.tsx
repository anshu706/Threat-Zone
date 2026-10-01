import React from 'react';
import type { SimulationResult, ScenarioPreset } from '../types/physics';
import { Zap, Radius, Bomb } from 'lucide-react';

interface QuickStatsBarProps {
  result: SimulationResult;
  selectedScenario: ScenarioPreset;
}

export const QuickStatsBar: React.FC<QuickStatsBarProps> = ({ result, selectedScenario }) => {
  const isBleve = selectedScenario.type === 'BLEVE';
  const maxRadius = isBleve
    ? Math.max(...result.thermalZones.map((z) => z.radius))
    : Math.max(...result.overpressureZones.map((z) => z.radius));

  return (
    <div className="quick-stats-bar">
      <div className="quick-stat">
        <Bomb className="w-3.5 h-3.5 text-rose-400" />
        <div>
          <span className="quick-stat-label">TNT Eq.</span>
          <span className="quick-stat-value">{result.tntMass.toLocaleString()} kg</span>
        </div>
      </div>
      <div className="quick-stat-divider" />
      <div className="quick-stat">
        <Zap className="w-3.5 h-3.5 text-amber-400" />
        <div>
          <span className="quick-stat-label">Energy</span>
          <span className="quick-stat-value">{result.blastEnergy.toLocaleString()} MJ</span>
        </div>
      </div>
      <div className="quick-stat-divider" />
      <div className="quick-stat">
        <Radius className="w-3.5 h-3.5 text-cyan-400" />
        <div>
          <span className="quick-stat-label">Safe Zone</span>
          <span className="quick-stat-value">{maxRadius.toFixed(0)} m</span>
        </div>
      </div>
      <div className="quick-stat-divider" />
      <div className="quick-stat">
        <span className={`scenario-type-pill scenario-type-${selectedScenario.type.toLowerCase()}`}>
          {selectedScenario.type}
        </span>
      </div>
    </div>
  );
};
