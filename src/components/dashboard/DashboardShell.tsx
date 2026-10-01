import React, { useState } from 'react';
import { Sun, Moon, RotateCcw, ArrowLeft } from 'lucide-react';
import { ControlPanel } from './ControlPanel';
import { AnalyticsPanel } from './AnalyticsPanel';
import { ExportBar } from './ExportBar';
import { RiskMap3D as RiskMap, type MapLayers } from '../RiskMap3D';
import type { ExplosionModel } from './ModelToggle';
import type { Hydrocarbon, IndianRegion, ScenarioPreset, SimulationResult } from '../../types/physics';

interface DashboardShellProps {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  onRestartTour?: () => void;
  onBackToLanding?: () => void;
  selectedRegion: IndianRegion;
  onRegionChange: (r: IndianRegion) => void;
  explosionModel: ExplosionModel;
  onModelChange: (m: ExplosionModel) => void;
  selectedScenario: ScenarioPreset;
  onScenarioChange: (s: ScenarioPreset) => void;
  selectedHydrocarbon: Hydrocarbon;
  onHydrocarbonChange: (h: Hydrocarbon) => void;
  volume: number;
  setVolume: (v: number) => void;
  fillPercent: number;
  setFillPercent: (v: number) => void;
  pressure: number;
  setPressure: (v: number) => void;
  temp: number;
  setTemp: (v: number) => void;
  yieldPercent: number;
  ambientTemp: number;
  setAmbientTemp: (v: number) => void;
  humidity: number;
  setHumidity: (v: number) => void;
  windSpeed: number;
  setWindSpeed: (v: number) => void;
  windDirection: number;
  setWindDirection: (v: number) => void;
  result: SimulationResult;
  onReset: () => void;
  exportParams: Record<string, number | string>;
}

type MobilePanel = 'control' | 'map' | 'analytics';

export const DashboardShell: React.FC<DashboardShellProps> = (props) => {
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>('map');
  const [layers, setLayers] = useState<MapLayers>({ blast: true, thermal: true, fragment: false });

  const toggleLayer = (key: keyof MapLayers) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="ids-app">
      <header className="ids-topbar">
        <div className="ids-topbar-brand">
          {props.onBackToLanding && (
            <button
              type="button"
              className="ids-btn ids-btn-icon"
              onClick={props.onBackToLanding}
              title="Back to landing page"
              style={{ marginRight: '0.25rem' }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          )}
          <div className="ids-topbar-logo">TZ</div>
          <div>
            <p className="ids-topbar-title">Threat Zone</p>
            <p className="ids-topbar-tagline">VCE & BLEVE · India Industrial Safety</p>
          </div>
        </div>
        <span className="ids-live-badge">
          <span className="ids-live-dot" /> Physics engine live
        </span>
        <div className="ids-topbar-actions">
          <ExportBar
            result={props.result}
            selectedScenario={props.selectedScenario}
            selectedRegion={props.selectedRegion}
            params={props.exportParams}
          />
          {props.onRestartTour && (
            <button type="button" className="ids-btn ids-btn-icon" onClick={props.onRestartTour} title="Restart tour">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
          <button type="button" className="ids-btn ids-btn-icon" onClick={() => props.setDarkMode(!props.darkMode)}>
            {props.darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      <div className="ids-mobile-tabs">
        {(['control', 'map', 'analytics'] as const).map((p) => (
          <button
            key={p}
            type="button"
            className={`ids-tab ${mobilePanel === p ? 'ids-tab-active' : ''}`}
            onClick={() => setMobilePanel(p)}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="ids-dashboard">
        <aside className={`ids-panel ids-panel-left ${mobilePanel !== 'control' ? 'ids-panel-hidden-mobile' : ''}`}>
          <div className="ids-panel-header">
            <h2 className="ids-panel-title">Scenario & physics input</h2>
          </div>
          <div className="ids-panel-body">
            <ControlPanel
              selectedRegion={props.selectedRegion}
              onRegionChange={props.onRegionChange}
              explosionModel={props.explosionModel}
              onModelChange={props.onModelChange}
              selectedScenario={props.selectedScenario}
              onScenarioChange={props.onScenarioChange}
              selectedHydrocarbon={props.selectedHydrocarbon}
              onHydrocarbonChange={props.onHydrocarbonChange}
              volume={props.volume}
              setVolume={props.setVolume}
              fillPercent={props.fillPercent}
              setFillPercent={props.setFillPercent}
              pressure={props.pressure}
              setPressure={props.setPressure}
              temp={props.temp}
              setTemp={props.setTemp}
              ambientTemp={props.ambientTemp}
              setAmbientTemp={props.setAmbientTemp}
              humidity={props.humidity}
              setHumidity={props.setHumidity}
              windSpeed={props.windSpeed}
              setWindSpeed={props.setWindSpeed}
              windDirection={props.windDirection}
              setWindDirection={props.setWindDirection}
              result={props.result}
              onReset={props.onReset}
            />
          </div>
        </aside>

        <main className={`ids-panel ids-panel-center ${mobilePanel !== 'map' ? 'ids-panel-hidden-mobile' : ''}`}>
          <div className="ids-panel-body ids-panel-body-flush" style={{ position: 'relative', height: '100%' }}>
            <div className="ids-map-toolbar">
              <div className="ids-layer-chips">
                <button type="button" className={`ids-layer-chip ${layers.blast ? 'ids-layer-chip-active' : ''}`} onClick={() => toggleLayer('blast')}>
                  Blast rings
                </button>
                <button type="button" className={`ids-layer-chip ${layers.thermal ? 'ids-layer-chip-active' : ''}`} onClick={() => toggleLayer('thermal')}>
                  Thermal contours
                </button>
                <button type="button" className={`ids-layer-chip ${layers.fragment ? 'ids-layer-chip-active' : ''}`} onClick={() => toggleLayer('fragment')}>
                  Fragment throw
                </button>
              </div>
              <div className="ids-wind-compass" title={`Wind ${props.windSpeed} km/h @ ${props.windDirection}°`}>
                <div className="ids-wind-arrow" style={{ transform: `rotate(${props.windDirection}deg)` }} />
              </div>
            </div>
            <RiskMap
              result={props.result}
              selectedScenario={props.selectedScenario}
              selectedRegion={props.selectedRegion}
              darkMode={props.darkMode}
              onSelectRegion={props.onRegionChange}
              layers={layers}
              windDirection={props.windDirection}
              windSpeedKph={props.windSpeed}
              ambientTemp={props.ambientTemp}
              humidity={props.humidity}
              embedded
            />
          </div>
        </main>

        <aside className={`ids-panel ids-panel-right ${mobilePanel !== 'analytics' ? 'ids-panel-hidden-mobile' : ''}`}>
          <div className="ids-panel-header">
            <h2 className="ids-panel-title">Analytics & guidance</h2>
          </div>
          <AnalyticsPanel
            result={props.result}
            selectedScenario={props.selectedScenario}
            selectedHydrocarbon={props.selectedHydrocarbon}
            selectedRegion={props.selectedRegion}
            volume={props.volume}
            fillPercent={props.fillPercent}
            pressure={props.pressure}
            temp={props.temp}
            yieldPercent={props.yieldPercent}
            ambientTemp={props.ambientTemp}
            humidity={props.humidity}
          />
        </aside>
      </div>
    </div>
  );
};
