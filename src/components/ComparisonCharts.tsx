import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import type { Hydrocarbon, IndianRegion, ScenarioPreset, SimulationResult } from '../types/physics';
import { runSimulation } from '../utils/physics';
import { InfoBox } from './InfoBox';

interface ComparisonChartsProps {
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

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const ComparisonCharts: React.FC<ComparisonChartsProps> = ({
  result,
  selectedScenario,
  selectedHydrocarbon,
  selectedRegion,
  volume,
  fillPercent,
  pressure,
  temp,
  yieldPercent,
  ambientTemp,
  humidity,
}) => {
  const isBleve = selectedScenario.type === 'BLEVE';

  const temperatureData = useMemo(
    () => [
      { name: 'Site weather', value: selectedRegion.weather.tempC, unit: '°C' },
      { name: 'Your ambient', value: ambientTemp, unit: '°C' },
      { name: 'Process temp', value: temp, unit: '°C' },
      { name: 'Boiling point', value: selectedHydrocarbon.boilingPoint, unit: '°C' },
    ],
    [selectedRegion.weather.tempC, ambientTemp, temp, selectedHydrocarbon.boilingPoint]
  );

  const environmentData = useMemo(
    () => [
      { name: 'Site humidity', value: selectedRegion.weather.humidity, unit: '%' },
      { name: 'Your humidity', value: humidity, unit: '%' },
      { name: 'Pressure', value: pressure, unit: ' bar' },
      { name: 'Tank fill', value: fillPercent, unit: '%' },
    ],
    [selectedRegion.weather.humidity, humidity, pressure, fillPercent]
  );

  const ambientSensitivity = useMemo(() => {
    return [10, 20, 30, 40, 50].map((at) => {
      const sim = runSimulation(
        selectedScenario,
        selectedHydrocarbon,
        volume,
        fillPercent,
        pressure,
        temp,
        yieldPercent,
        at,
        humidity
      );
      const maxThermal = isBleve
        ? Math.max(...sim.thermalZones.map((z) => z.radius), 0)
        : 0;
      const maxBlast = Math.max(...sim.overpressureZones.map((z) => z.radius), 0);
      return {
        ambient: `${at}°C`,
        tnt: sim.tntMass,
        blastRadius: maxBlast,
        thermalRadius: maxThermal,
      };
    });
  }, [
    selectedScenario,
    selectedHydrocarbon,
    volume,
    fillPercent,
    pressure,
    temp,
    yieldPercent,
    humidity,
    isBleve,
  ]);

  const humiditySensitivity = useMemo(() => {
    if (!isBleve) return [];
    return [30, 50, 70, 90].map((rh) => {
      const sim = runSimulation(
        selectedScenario,
        selectedHydrocarbon,
        volume,
        fillPercent,
        pressure,
        temp,
        yieldPercent,
        ambientTemp,
        rh
      );
      const maxThermal = Math.max(...sim.thermalZones.map((z) => z.radius), 0);
      return {
        humidity: `${rh}%`,
        thermalRadius: maxThermal,
      };
    });
  }, [
    isBleve,
    selectedScenario,
    selectedHydrocarbon,
    volume,
    fillPercent,
    pressure,
    temp,
    yieldPercent,
    ambientTemp,
  ]);

  const tooltipStyle = {
    backgroundColor: 'var(--ca-bg-elevated)',
    border: '1px solid var(--ca-border)',
    borderRadius: 0,
    fontSize: 11,
    fontFamily: 'var(--ca-mono)',
  };

  return (
    <div className="ca-compare-grid">
      <div className="ca-panel ca-chart-panel">
        <p className="ca-section-label">Temperature</p>
        <h3 className="ca-chart-title">How hot is each layer?</h3>
        <InfoBox title="What this shows">
          Compares weather at the site, your ambient setting, process temperature, and when the fuel
          starts to boil. Bigger gaps mean more flashing or heat stress.
        </InfoBox>
        <div className="ca-chart-wrap">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={temperatureData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--ca-border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--ca-fg-muted)' }} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--ca-fg-muted)' }} tickLine={false} unit="°C" />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => [`${value ?? 0}°C`, 'Temperature']}
              />
              <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                {temperatureData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="ca-panel ca-chart-panel">
        <p className="ca-section-label">Environment</p>
        <h3 className="ca-chart-title">Site vs your settings</h3>
        <InfoBox title="What this shows">
          Side-by-side view of humidity at {selectedRegion.name}, your inputs, vessel pressure, and
          how full the tank is.
        </InfoBox>
        <div className="ca-chart-wrap">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={environmentData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--ca-border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--ca-fg-muted)' }} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--ca-fg-muted)' }} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" fill="#10b981" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="ca-panel ca-chart-panel ca-chart-panel-wide">
        <p className="ca-section-label">Ambient sensitivity</p>
        <h3 className="ca-chart-title">If air temperature changes</h3>
        <InfoBox title="What this shows">
          TNT equivalent stays similar, but {isBleve ? 'thermal reach' : 'blast reach'} shifts with
          ambient air temperature. Useful for summer vs winter planning.
        </InfoBox>
        <div className="ca-chart-wrap">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={ambientSensitivity} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--ca-border)" vertical={false} />
              <XAxis dataKey="ambient" tick={{ fontSize: 10, fill: 'var(--ca-fg-muted)' }} />
              <YAxis yAxisId="left" tick={{ fontSize: 10, fill: 'var(--ca-fg-muted)' }} />
              {isBleve && (
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: 'var(--ca-fg-muted)' }} unit=" m" />
              )}
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="tnt"
                name="TNT (kg)"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="blastRadius"
                name="Blast radius (m)"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              {isBleve && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="thermalRadius"
                  name="Thermal radius (m)"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {isBleve && humiditySensitivity.length > 0 && (
        <div className="ca-panel ca-chart-panel ca-chart-panel-wide">
          <p className="ca-section-label">Humidity sensitivity</p>
          <h3 className="ca-chart-title">How humidity changes heat reach</h3>
          <InfoBox title="What this shows">
            Higher humidity can slightly reduce how far dangerous heat travels from a fireball. Compare
            dry vs monsoon conditions.
          </InfoBox>
          <div className="ca-chart-wrap">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={humiditySensitivity} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--ca-border)" vertical={false} />
                <XAxis dataKey="humidity" tick={{ fontSize: 10, fill: 'var(--ca-fg-muted)' }} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--ca-fg-muted)' }} unit=" m" />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="thermalRadius"
                  name="Thermal radius (m)"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="ca-panel ca-chart-panel ca-summary-strip">
        <p className="ca-section-label">Current run</p>
        <div className="ca-summary-grid">
          <div>
            <span className="ca-kpi-label">TNT equivalent</span>
            <span className="ca-kpi-value">{result.tntMass.toLocaleString()} kg</span>
          </div>
          <div>
            <span className="ca-kpi-label">Workforce on site</span>
            <span className="ca-kpi-value">{selectedRegion.workforceLive.toLocaleString()}</span>
          </div>
          <div>
            <span className="ca-kpi-label">Site wind</span>
            <span className="ca-kpi-value">{selectedRegion.weather.windKph} km/h</span>
          </div>
          <div>
            <span className="ca-kpi-label">Scenario</span>
            <span className="ca-kpi-value" style={{ fontSize: '0.95rem' }}>{selectedScenario.type}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
