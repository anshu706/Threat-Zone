import React, { useState } from 'react';
import type { Hydrocarbon, IndianRegion, ScenarioPreset, SimulationResult } from '../../types/physics';
import { RiskCharts } from '../RiskCharts';
import { ComparisonCharts } from '../ComparisonCharts';
import { Advisories } from '../Advisories';

type AnalyticsTab = 'decay' | 'compare' | 'safety';

interface AnalyticsPanelProps {
  result: SimulationResult;
  selectedScenario: ScenarioPreset;
  selectedHydrocarbon: Hydrocarbon;
  selectedRegion: IndianRegion;
  volume: number;
  fillPercent: number;
  pressure: number;
  temp: number;
  yieldPercent: number;
  ambientTemp: number;
  humidity: number;
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = (props) => {
  const [tab, setTab] = useState<AnalyticsTab>('decay');
  const [chartTab, setChartTab] = useState<'blast' | 'thermal'>('blast');
  const { result, selectedScenario, ambientTemp, humidity } = props;
  const isBleve = selectedScenario.type === 'BLEVE';

  return (
    <>
      <div className="ids-tabs">
        {(['decay', 'compare', 'safety'] as const).map((t) => (
          <button
            key={t}
            type="button"
            className={`ids-tab ${tab === t ? 'ids-tab-active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'decay' ? 'Decay' : t === 'compare' ? 'Compare' : 'Safety'}
          </button>
        ))}
      </div>

      <div className="ids-panel-body">
        {tab === 'decay' && (
          <>
            <div className="ids-alert">
              <p className="ids-alert-title">Distance-decay analysis</p>
              <p className="ids-alert-body">
                Overpressure (psi) and thermal flux (kW/m²) vs. standoff distance from ignition point.
              </p>
            </div>
            <div className="ids-segment" style={{ marginBottom: '1rem' }}>
              <button
                type="button"
                className={`ids-segment-btn ${chartTab === 'blast' ? 'ids-segment-btn-active' : ''}`}
                onClick={() => setChartTab('blast')}
              >
                Blast
              </button>
              <button
                type="button"
                className={`ids-segment-btn ${chartTab === 'thermal' ? 'ids-segment-btn-active' : ''}`}
                onClick={() => setChartTab('thermal')}
                disabled={!isBleve}
              >
                Thermal
              </button>
            </div>
            <RiskCharts
              result={result}
              selectedScenario={selectedScenario}
              ambientTemp={ambientTemp}
              humidity={humidity}
              activeTab={chartTab}
            />
          </>
        )}

        {tab === 'compare' && (
          <>
            <div className="ids-alert">
              <p className="ids-alert-title">Environmental comparison</p>
              <p className="ids-alert-body">
                How temperature, humidity, and wind alter hazard reach at {props.selectedRegion.name}.
              </p>
            </div>
            <ComparisonCharts {...props} />
          </>
        )}

        {tab === 'safety' && (
          <>
            <div className="ids-alert ids-alert-critical">
              <p className="ids-alert-title">Immediate personnel response</p>
              <p className="ids-alert-body">
                Evacuate all personnel beyond Zone 4 boundary. Full fire-resistant PPE required inside Zone 3.
                Do not approach vessel unless deluge cooling is active (BLEVE).
              </p>
            </div>
            <div className="ids-alert">
              <p className="ids-alert-title">Structural vulnerability</p>
              <p className="ids-alert-body">
                Zone 1–2: pipe rack collapse, control room window failure, steel deformation. Zone 3: masonry
                and cladding damage. Review occupied buildings within {Math.max(...result.overpressureZones.map((z) => z.radius), 0).toFixed(0)} m.
              </p>
            </div>
            <Advisories selectedScenario={selectedScenario} />
          </>
        )}
      </div>
    </>
  );
};
