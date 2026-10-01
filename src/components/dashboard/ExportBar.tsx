import React from 'react';
import { Copy, Printer, Link2 } from 'lucide-react';
import type { SimulationResult, ScenarioPreset, IndianRegion } from '../../types/physics';
import { copyScenarioSummary, copyScenarioUrl } from '../../utils/exportScenario';

interface ExportBarProps {
  result: SimulationResult;
  selectedScenario: ScenarioPreset;
  selectedRegion: IndianRegion;
  params: Record<string, number | string>;
}

export const ExportBar: React.FC<ExportBarProps> = ({
  result,
  selectedScenario,
  selectedRegion,
  params,
}) => {
  const handleCopy = async () => {
    try {
      await copyScenarioSummary(result, selectedScenario, selectedRegion);
    } catch {}
  };

  const handleUrl = async () => {
    try {
      await copyScenarioUrl({ regionId: selectedRegion.id, scenarioId: selectedScenario.id, ...params });
    } catch {}
  };

  return (
    <>
      <button type="button" className="ids-btn ids-btn-icon" onClick={handleCopy} title="Copy summary">
        <Copy className="w-3.5 h-3.5" />
      </button>
      <button type="button" className="ids-btn ids-btn-icon" onClick={handleUrl} title="Copy share link">
        <Link2 className="w-3.5 h-3.5" />
      </button>
      <button type="button" className="ids-btn ids-btn-icon" onClick={() => window.print()} title="Print / PDF">
        <Printer className="w-3.5 h-3.5" />
      </button>
    </>
  );
};
