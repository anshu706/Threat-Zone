import React from 'react';
import type { SimulationResult, ScenarioPreset, IndianRegion } from '../types/physics';

interface StatusTickerProps {
  result: SimulationResult;
  selectedScenario: ScenarioPreset;
  selectedRegion: IndianRegion;
}

export const StatusTicker: React.FC<StatusTickerProps> = ({
  result,
  selectedScenario,
  selectedRegion,
}) => {
  const isBleve = selectedScenario.type === 'BLEVE';
  const maxRadius = isBleve
    ? Math.max(...result.thermalZones.map((z) => z.radius))
    : Math.max(...result.overpressureZones.map((z) => z.radius));

  const items = [
    <>Region <strong>{selectedRegion.name.toUpperCase()}</strong></>,
    <>State <strong>{selectedRegion.state.toUpperCase()}</strong></>,
    <>Type <strong>{selectedScenario.type}</strong></>,
    <>TNT <strong>{result.tntMass.toLocaleString()} kg</strong></>,
    <>Energy <strong>{result.blastEnergy.toLocaleString()} MJ</strong></>,
    <>Safe boundary <strong>{maxRadius.toFixed(0)} m</strong></>,
    <>India facilities <strong>10</strong></>,
    <>Engine <strong>LIVE</strong></>,
  ];

  const doubled = [...items, ...items];

  return (
    <div className="ca-ticker-wrap">
      <div className="ca-ticker" aria-hidden="true">
        {doubled.map((item, i) => (
          <React.Fragment key={i}>
            <span className="ca-ticker-item">{item}</span>
            <span className="ca-ticker-dot" />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
