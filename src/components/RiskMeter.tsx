import React, { useMemo } from 'react';
import type { SimulationResult, ScenarioPreset } from '../types/physics';
import { AlertTriangle, CheckCircle2, AlertOctagon } from 'lucide-react';

interface RiskMeterProps {
  result: SimulationResult;
  selectedScenario: ScenarioPreset;
}

function getRiskLevel(result: SimulationResult, scenario: ScenarioPreset): {
  score: number;
  label: string;
  color: string;
} {
  const isBleve = scenario.type === 'BLEVE';
  const maxRadius = isBleve
    ? Math.max(...result.thermalZones.map((z) => z.radius), 0)
    : Math.max(...result.overpressureZones.map((z) => z.radius), 0);

  let score = 0;
  if (result.tntMass > 5000) score += 35;
  else if (result.tntMass > 1000) score += 25;
  else if (result.tntMass > 200) score += 15;
  else score += 5;

  if (maxRadius > 500) score += 35;
  else if (maxRadius > 200) score += 25;
  else if (maxRadius > 50) score += 15;
  else score += 5;

  if (isBleve && result.surfaceEmissivePower > 150) score += 30;
  else if (isBleve) score += 10;

  score = Math.min(100, score);

  if (score >= 70) return { score, label: 'Critical', color: '#ef4444' };
  if (score >= 45) return { score, label: 'High', color: '#f97316' };
  if (score >= 25) return { score, label: 'Moderate', color: '#eab308' };
  return { score, label: 'Low', color: '#10b981' };
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ result, selectedScenario }) => {
  const risk = useMemo(() => getRiskLevel(result, selectedScenario), [result, selectedScenario]);

  const Icon =
    risk.label === 'Low' ? CheckCircle2 : risk.label === 'Moderate' ? AlertTriangle : AlertOctagon;

  return (
    <div className="risk-meter">
      <div className="risk-meter-header">
        <Icon className="w-4 h-4" style={{ color: risk.color }} />
        <span className="risk-meter-label">Threat Level</span>
        <span className="risk-meter-value" style={{ color: risk.color }}>
          {risk.label}
        </span>
      </div>
      <div className="risk-meter-track">
        <div
          className="risk-meter-fill"
          style={{
            width: `${risk.score}%`,
            background: `linear-gradient(90deg, ${risk.color}88, ${risk.color})`,
            boxShadow: `0 0 12px ${risk.color}66`,
          }}
        />
        <div className="risk-meter-markers">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="risk-meter-scale">
        <span>Low</span>
        <span>Moderate</span>
        <span>High</span>
        <span>Critical</span>
      </div>
    </div>
  );
};
