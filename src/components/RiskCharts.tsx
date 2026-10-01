import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { getOverpressureAtDistance, getThermalFluxAtDistance } from '../utils/physics';
import type { SimulationResult, ScenarioPreset } from '../types/physics';
import { Thermometer } from 'lucide-react';

interface RiskChartsProps {
  result: SimulationResult;
  selectedScenario: ScenarioPreset;
  ambientTemp: number;
  humidity: number;
  activeTab: 'blast' | 'thermal';
}

export const RiskCharts: React.FC<RiskChartsProps> = ({
  result,
  selectedScenario,
  ambientTemp,
  humidity,
  activeTab
}) => {
  const isBleve = selectedScenario.type === 'BLEVE';

  // Generate chart data for Blast
  const blastData = useMemo(() => {
    if (result.tntMass <= 0) return [];
    
    // Find maximum zone radius to scale chart X-axis
    const maxRadius = Math.max(...result.overpressureZones.map(z => z.radius), 50);
    const start = Math.max(1, maxRadius * 0.02);
    const end = Math.max(100, maxRadius * 1.5);
    const step = (end - start) / 60;
    
    const data = [];
    for (let r = start; r <= end; r += step) {
      const bar = getOverpressureAtDistance(r, result.tntMass);
      const psi = bar * 14.5038;
      data.push({
        distance: Math.round(r * 10) / 10,
        overpressureBar: parseFloat(bar.toFixed(3)),
        overpressurePsi: parseFloat(psi.toFixed(2))
      });
    }
    return data;
  }, [result.tntMass, result.overpressureZones]);

  // Generate chart data for Thermal
  const thermalData = useMemo(() => {
    if (!isBleve || result.fireballDiameter <= 0) return [];
    
    const rFireball = result.fireballDiameter / 2;
    const maxRadius = Math.max(...result.thermalZones.map(z => z.radius), 50);
    const start = rFireball;
    const end = Math.max(100, maxRadius * 1.5);
    const step = (end - start) / 60;
    
    const data = [];
    const rhFraction = humidity / 100;
    
    for (let r = start; r <= end; r += step) {
      const flux = getThermalFluxAtDistance(
        r,
        result.fireballDiameter,
        result.surfaceEmissivePower,
        ambientTemp,
        rhFraction
      );
      data.push({
        distance: Math.round(r * 10) / 10,
        heatFlux: parseFloat(flux.toFixed(2))
      });
    }
    return data;
  }, [isBleve, result.fireballDiameter, result.surfaceEmissivePower, result.thermalZones, ambientTemp, humidity]);

  const activeData: Record<string, number>[] = activeTab === 'thermal' ? thermalData : blastData;
  const activeColor = activeTab === 'thermal' ? '#f97316' : '#06b6d4'; // Cyan for Blast, Orange for Thermal

  return (
    <div className="space-y-4">
      <p className="ca-list-desc" style={{ margin: 0 }}>
        {activeTab === 'thermal'
          ? 'Heat from a fireball at each distance from the center.'
          : 'Blast pressure at each distance from the explosion.'}
      </p>

      {activeTab === 'thermal' && !isBleve ? (
        <div className="ca-chart-empty">
          <Thermometer className="w-8 h-8 mb-2" style={{ opacity: 0.4 }} />
          <p className="ca-list-title">Heat chart not available</p>
          <p className="ca-list-desc">Select a BLEVE scenario to see thermal radiation.</p>
        </div>
      ) : activeData.length === 0 ? (
        <div className="ca-chart-empty">
          <p className="ca-list-desc">Calculating…</p>
        </div>
      ) : (
        <div className="ca-chart-wrap" style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={activeData}
              margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
            >
              <defs>
                <linearGradient id="colorBlast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorThermal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="#27272a" opacity={0.4} vertical={false} />
              <XAxis 
                dataKey="distance" 
                stroke="#71717a" 
                tickLine={false}
                axisLine={{ stroke: '#3f3f46' }}
                label={{
                  value: 'Distance from center (m)',
                  position: 'bottom',
                  offset: 5,
                  fill: 'var(--ca-fg-muted)',
                  fontSize: 10,
                }} 
              />
              <YAxis 
                stroke="#71717a"
                tickLine={false}
                axisLine={false}
                label={{
                  value: activeTab === 'thermal' ? 'Heat (kW/m²)' : 'Pressure (bar)',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 10,
                  fill: 'var(--ca-fg-muted)',
                  fontSize: 10,
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(9, 9, 11, 0.9)',
                  backdropFilter: 'blur(8px)',
                  borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: '#f4f4f5',
                  boxShadow: '0 0 15px rgba(0,0,0,0.5)',
                  fontSize: '11px',
                  textTransform: 'uppercase'
                }}
                itemStyle={{ color: activeColor, fontWeight: 'bold' }}
                labelStyle={{ color: '#71717a' }}
                labelFormatter={(value) => `DIST: ${value} m`}
              />
              
              <g className="oscilloscope-glow">
              {/* Reference thresholds */}
              {activeTab === 'blast' ? (
                <>
                  <Area
                    type="monotone"
                    dataKey="overpressureBar"
                    name="OVERPRESSURE"
                    stroke="#06b6d4"
                    fillOpacity={1}
                    fill="url(#colorBlast)"
                    strokeWidth={2}
                    activeDot={{ r: 4, stroke: '#000', strokeWidth: 1, fill: '#06b6d4' }}
                  />
                  {/* Highlight thresholds - matching Zone colors */}
                  <ReferenceLine y={0.7} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'ZONE 1', fill: '#ef4444', position: 'right', fontSize: 8 }} />
                  <ReferenceLine y={0.3} stroke="#f97316" strokeDasharray="3 3" label={{ value: 'ZONE 2', fill: '#f97316', position: 'right', fontSize: 8 }} />
                  <ReferenceLine y={0.1} stroke="#eab308" strokeDasharray="3 3" label={{ value: 'ZONE 3', fill: '#eab308', position: 'right', fontSize: 8 }} />
                </>
              ) : (
                <>
                  <Area
                    type="monotone"
                    dataKey="heatFlux"
                    name="HEAT FLUX"
                    stroke="#f97316"
                    fillOpacity={1}
                    fill="url(#colorThermal)"
                    strokeWidth={2}
                    activeDot={{ r: 4, stroke: '#000', strokeWidth: 1, fill: '#f97316' }}
                  />
                  {/* Highlight thresholds */}
                  <ReferenceLine y={37.5} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'ZONE 1', fill: '#ef4444', position: 'right', fontSize: 8 }} />
                  <ReferenceLine y={12.5} stroke="#f97316" strokeDasharray="3 3" label={{ value: 'ZONE 2', fill: '#f97316', position: 'right', fontSize: 8 }} />
                  <ReferenceLine y={4.0} stroke="#eab308" strokeDasharray="3 3" label={{ value: 'ZONE 3', fill: '#eab308', position: 'right', fontSize: 8 }} />
                </>
              )}
              </g>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
