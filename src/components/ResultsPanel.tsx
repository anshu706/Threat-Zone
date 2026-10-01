import React from 'react';
import type { SimulationResult, ScenarioPreset } from '../types/physics';
import { RiskMeter } from './RiskMeter';
import { InfoBox } from './InfoBox';
import { BLAST_ZONE_PLAIN, THERMAL_ZONE_PLAIN, getRiskSummary } from '../utils/plainLanguage';

interface ResultsPanelProps {
  result: SimulationResult;
  selectedScenario: ScenarioPreset;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ result, selectedScenario }) => {
  const isBleve = selectedScenario.type === 'BLEVE';

  const hasHighBlast = result.tntMass > 1000;
  const hasExtremeThermal = isBleve && result.surfaceEmissivePower > 150;
  const hasMassiveRadius = result.overpressureZones[0]?.radius > 50;

  const maxRadius = isBleve
    ? Math.max(...result.thermalZones.map((z) => z.radius), 0)
    : Math.max(...result.overpressureZones.map((z) => z.radius), 0);

  return (
    <div className="ca-panel space-y-6">
      <RiskMeter result={result} selectedScenario={selectedScenario} />

      <InfoBox title="In plain terms">{getRiskSummary(result.tntMass, maxRadius)}</InfoBox>

      <div className="flex flex-wrap gap-2">
        {hasHighBlast && <span className="ca-chip">Strong blast</span>}
        {hasExtremeThermal && <span className="ca-chip">Extreme heat</span>}
        {hasMassiveRadius && <span className="ca-chip">Large danger area</span>}
        {!hasHighBlast && !hasExtremeThermal && !hasMassiveRadius && (
          <span className="ca-chip">Lower risk</span>
        )}
      </div>

      <div className="ca-kpi-grid">
        <div className="ca-kpi">
          <span className="ca-kpi-label">Blast strength (TNT)</span>
          <span className="ca-kpi-value">
            {result.tntMass.toLocaleString()}
            <span className="ca-kpi-unit"> kg</span>
          </span>
        </div>
        <div className="ca-kpi">
          <span className="ca-kpi-label">Total energy released</span>
          <span className="ca-kpi-value">
            {result.blastEnergy.toLocaleString()}
            <span className="ca-kpi-unit"> MJ</span>
          </span>
        </div>
        <div className="ca-kpi">
          <span className="ca-kpi-label">Fuel involved</span>
          <span className="ca-kpi-value">
            {result.fuelMassInvolved.toLocaleString()}
            <span className="ca-kpi-unit"> kg</span>
          </span>
        </div>
        <div className="ca-kpi">
          <span className="ca-kpi-label">Keep people beyond</span>
          <span className="ca-kpi-value">
            {maxRadius.toFixed(0)}
            <span className="ca-kpi-unit"> m</span>
          </span>
        </div>
      </div>

      {isBleve && (
        <div className="ca-panel" style={{ padding: '1rem' }}>
          <p className="ca-section-label">Fireball (BLEVE)</p>
          <InfoBox>
            A BLEVE creates a large fireball. These numbers describe its size and how long it lasts.
          </InfoBox>
          <div className="ca-kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="ca-kpi">
              <span className="ca-kpi-label">Diameter</span>
              <span className="ca-kpi-value">
                {result.fireballDiameter}
                <span className="ca-kpi-unit"> m</span>
              </span>
            </div>
            <div className="ca-kpi">
              <span className="ca-kpi-label">Duration</span>
              <span className="ca-kpi-value">
                {result.fireballDuration}
                <span className="ca-kpi-unit"> s</span>
              </span>
            </div>
            <div className="ca-kpi">
              <span className="ca-kpi-label">Heat output</span>
              <span className="ca-kpi-value">
                {result.surfaceEmissivePower}
                <span className="ca-kpi-unit"> kW/m²</span>
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="ca-panel">
          <p className="ca-section-label">Blast zones</p>
          <InfoBox>Distance rings for pressure waves. Zone 4 is the safest outer limit.</InfoBox>
          {result.overpressureZones.map((zone) => (
            <div key={zone.zone} className="ca-list-item">
              <span className="ca-list-num">Z{zone.zone}</span>
              <div className="ca-list-body">
                <p className="ca-list-title">{zone.label}</p>
                <p className="ca-list-desc">{BLAST_ZONE_PLAIN[zone.zone] ?? zone.description}</p>
              </div>
              <div className="ca-list-stat">
                {zone.radius} m
                <br />
                <span style={{ fontSize: '9px', color: 'var(--ca-fg-subtle)' }}>
                  ≥ {zone.threshold} bar
                </span>
              </div>
            </div>
          ))}
        </div>

        {isBleve ? (
          <div className="ca-panel">
            <p className="ca-section-label">Heat zones</p>
            <InfoBox>How far deadly heat reaches from the fireball.</InfoBox>
            {result.thermalZones.map((zone) => (
              <div key={zone.zone} className="ca-list-item">
                <span className="ca-list-num">Z{zone.zone}</span>
                <div className="ca-list-body">
                  <p className="ca-list-title">{zone.label}</p>
                  <p className="ca-list-desc">{THERMAL_ZONE_PLAIN[zone.zone] ?? zone.description}</p>
                </div>
                <div className="ca-list-stat">
                  {zone.radius} m
                  <br />
                  <span style={{ fontSize: '9px', color: 'var(--ca-fg-subtle)' }}>
                    ≥ {zone.threshold} kW/m²
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="ca-panel flex flex-col justify-center min-h-[200px]">
            <p className="ca-section-label">Heat zones</p>
            <p className="ca-list-desc">
              No fireball heat for this scenario. Choose a BLEVE scenario to see heat zones.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
