import React from 'react';
import type { Hydrocarbon, IndianRegion, ScenarioPreset } from '../../types/physics';
import { INDIAN_REGIONS } from '../../constants/regions';
import { HYDROCARBONS, SCENARIOS } from '../../constants/data';
import { ModelToggle, type ExplosionModel } from './ModelToggle';
import { KpiBanner } from './KpiBanner';
import type { SimulationResult } from '../../types/physics';

interface ControlPanelProps {
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
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  selectedRegion,
  onRegionChange,
  explosionModel,
  onModelChange,
  selectedScenario,
  onScenarioChange,
  selectedHydrocarbon,
  onHydrocarbonChange,
  volume,
  setVolume,
  fillPercent,
  setFillPercent,
  pressure,
  setPressure,
  temp,
  setTemp,
  ambientTemp,
  setAmbientTemp,
  humidity,
  setHumidity,
  windSpeed,
  setWindSpeed,
  windDirection,
  setWindDirection,
  result,
  onReset,
}) => {
  const filteredScenarios = SCENARIOS.filter((s) =>
    explosionModel === 'BLEVE' ? s.type === 'BLEVE' : s.type !== 'BLEVE'
  );

  const handleModelChange = (model: ExplosionModel) => {
    onModelChange(model);
    const next = SCENARIOS.find((s) => (model === 'BLEVE' ? s.type === 'BLEVE' : s.type === 'VCE'));
    if (next) onScenarioChange(next);
  };

  return (
    <>
      <div className="ids-field">
        <label className="ids-label" htmlFor="site-select">Facility location</label>
        <select
          id="site-select"
          className="ids-select"
          value={selectedRegion.id}
          onChange={(e) => {
            const r = INDIAN_REGIONS.find((x) => x.id === e.target.value);
            if (r) onRegionChange(r);
          }}
        >
          {INDIAN_REGIONS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} — {r.facility}
            </option>
          ))}
        </select>
      </div>

      <div className="ids-field">
        <span className="ids-label">Explosion model</span>
        <ModelToggle value={explosionModel} onChange={handleModelChange} />
      </div>

      <div className="ids-field">
        <label className="ids-label" htmlFor="scenario-select">Scenario preset</label>
        <select
          id="scenario-select"
          className="ids-select"
          value={selectedScenario.id}
          onChange={(e) => {
            const s = SCENARIOS.find((x) => x.id === e.target.value);
            if (s) onScenarioChange(s);
          }}
        >
          {filteredScenarios.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      <div className="ids-field">
        <label className="ids-label" htmlFor="fuel-select">Fuel type</label>
        <select
          id="fuel-select"
          className="ids-select"
          value={selectedHydrocarbon.id}
          onChange={(e) => {
            const h = HYDROCARBONS.find((x) => x.id === e.target.value);
            if (h) onHydrocarbonChange(h);
          }}
        >
          {HYDROCARBONS.map((h) => (
            <option key={h.id} value={h.id}>{h.name} ({h.formula})</option>
          ))}
        </select>
      </div>

      <div className="ids-field">
        <label className="ids-label" htmlFor="pressure">
          Storage pressure <span className="ids-range-value">{pressure} bar</span>
        </label>
        <input id="pressure" type="range" className="ids-range" min={1} max={50} step={0.5} value={pressure} onChange={(e) => setPressure(+e.target.value)} />
      </div>

      <div className="ids-field">
        <label className="ids-label" htmlFor="temp">
          Temperature <span className="ids-range-value">{temp} °C</span>
        </label>
        <input id="temp" type="range" className="ids-range" min={-40} max={200} step={1} value={temp} onChange={(e) => setTemp(+e.target.value)} />
      </div>

      <div className="ids-field">
        <label className="ids-label" htmlFor="volume">
          Tank capacity <span className="ids-range-value">{volume} m³</span>
        </label>
        <input id="volume" type="range" className="ids-range" min={10} max={5000} step={10} value={volume} onChange={(e) => setVolume(+e.target.value)} />
      </div>

      <div className="ids-field">
        <label className="ids-label" htmlFor="fill">
          Tank fill <span className="ids-range-value">{fillPercent}%</span>
        </label>
        <input id="fill" type="range" className="ids-range" min={5} max={100} step={1} value={fillPercent} onChange={(e) => setFillPercent(+e.target.value)} />
      </div>

      <div className="ids-field">
        <label className="ids-label" htmlFor="ambient">
          Ambient temp <span className="ids-range-value">{ambientTemp} °C</span>
        </label>
        <input id="ambient" type="range" className="ids-range" min={0} max={50} step={1} value={ambientTemp} onChange={(e) => setAmbientTemp(+e.target.value)} />
      </div>

      <div className="ids-field">
        <label className="ids-label" htmlFor="humidity">
          Humidity <span className="ids-range-value">{humidity}%</span>
        </label>
        <input id="humidity" type="range" className="ids-range" min={10} max={95} step={1} value={humidity} onChange={(e) => setHumidity(+e.target.value)} />
      </div>

      <div className="ids-field">
        <label className="ids-label" htmlFor="wind">
          Wind speed <span className="ids-range-value">{windSpeed} km/h</span>
        </label>
        <input id="wind" type="range" className="ids-range" min={0} max={60} step={1} value={windSpeed} onChange={(e) => setWindSpeed(+e.target.value)} />
      </div>

      <div className="ids-field">
        <label className="ids-label" htmlFor="wind-dir">
          Wind direction <span className="ids-range-value">{windDirection}°</span>
        </label>
        <input id="wind-dir" type="range" className="ids-range" min={0} max={359} step={1} value={windDirection} onChange={(e) => setWindDirection(+e.target.value)} />
      </div>

      <button type="button" className="ids-btn" onClick={onReset} style={{ width: '100%', marginTop: '0.5rem' }}>
        Reset defaults
      </button>

      <KpiBanner result={result} selectedScenario={selectedScenario} />
    </>
  );
};
