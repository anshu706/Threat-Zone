import React from 'react';
import type { Hydrocarbon, ScenarioPreset } from '../types/physics';
import { HYDROCARBONS, SCENARIOS } from '../constants/data';
import { HelpCircle, ShieldCheck, Database, SlidersHorizontal, CloudRain } from 'lucide-react';
import { Accordion } from './Accordion';

interface InputPanelProps {
  selectedHydrocarbon: Hydrocarbon;
  setSelectedHydrocarbon: (h: Hydrocarbon) => void;
  selectedScenario: ScenarioPreset;
  setSelectedScenario: (s: ScenarioPreset) => void;
  volume: number;
  setVolume: (v: number) => void;
  fillPercent: number;
  setFillPercent: (fp: number) => void;
  pressure: number;
  setPressure: (p: number) => void;
  temp: number;
  setTemp: (t: number) => void;
  yieldPercent: number;
  setYieldPercent: (y: number) => void;
  ambientTemp: number;
  setAmbientTemp: (at: number) => void;
  humidity: number;
  setHumidity: (h: number) => void;
  onReset?: () => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  selectedHydrocarbon,
  setSelectedHydrocarbon,
  selectedScenario,
  setSelectedScenario,
  volume,
  setVolume,
  fillPercent,
  setFillPercent,
  pressure,
  setPressure,
  temp,
  setTemp,
  yieldPercent,
  setYieldPercent,
  ambientTemp,
  setAmbientTemp,
  humidity,
  setHumidity,
  onReset,
}) => {
  const handleScenarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const scenario = SCENARIOS.find((s) => s.id === e.target.value);
    if (scenario) {
      setSelectedScenario(scenario);
      setVolume(scenario.volumeDefault);
      setFillPercent(scenario.fillPercentDefault);
      setPressure(scenario.pressureDefault);
      setTemp(scenario.tempDefault);
      setYieldPercent(scenario.yieldDefault);

      // Match hydrocarbon to scenario preset material
      const matchedH = HYDROCARBONS.find((h) => h.id === scenario.materialId);
      if (matchedH) {
        setSelectedHydrocarbon(matchedH);
      }
    }
  };

  const handleHydrocarbonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const hydrocarbon = HYDROCARBONS.find((h) => h.id === e.target.value);
    if (hydrocarbon) {
      setSelectedHydrocarbon(hydrocarbon);
    }
  };

  return (
    <div className="ca-panel">
      <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: '1px solid var(--ca-border)' }}>
        <span className="ca-section-label" style={{ margin: 0 }}>Engine live</span>
        {onReset && (
          <button type="button" className="wizard-btn-ghost" onClick={onReset}>
            Reset defaults
          </button>
        )}
      </div>

      <Accordion
        title="Scenario Profile"
        icon={<Database className="w-4 h-4 text-cyan-500" />}
        badge={selectedScenario.type}
        defaultOpen
      >
      <div className="space-y-5">
        <div className="relative group/field">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block mb-2 flex items-center justify-between">
            <span>Operational Scenario</span>
            <div className="group relative cursor-pointer">
              <HelpCircle className="w-3.5 h-3.5 text-zinc-400 hover:text-cyan-400 transition-colors" />
              <div className="pointer-events-none absolute bottom-full right-0 mb-2 w-64 p-3 bg-zinc-900/90 backdrop-blur-md text-zinc-100 text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 leading-relaxed font-normal border border-zinc-700 transform translate-y-2 group-hover:translate-y-0">
                Select an operational deviation preset. These presets represent under-loading anomalies or critical refinery line configurations.
              </div>
            </div>
          </label>
          <div className="relative">
            <select
              value={selectedScenario.id}
              onChange={handleScenarioChange}
              className="w-full font-mono text-xs pl-3 pr-8 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700/50 rounded-lg text-zinc-800 dark:text-cyan-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all appearance-none shadow-inner"
            >
              {SCENARIOS.map((s) => (
                <option key={s.id} value={s.id} className="bg-zinc-900 text-zinc-200 font-sans">
                  {s.name} ({s.type})
                </option>
              ))}
            </select>
          </div>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed bg-zinc-50 dark:bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800/50 border-l-2 border-l-cyan-500/50 font-sans">
            {selectedScenario.description}
          </p>
        </div>

        {/* Hydrocarbon Selection */}
        <div className="relative group/field">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block mb-2 flex items-center justify-between">
            <span>Fuel / Material Setup</span>
            <div className="group relative cursor-pointer">
              <HelpCircle className="w-3.5 h-3.5 text-zinc-400 hover:text-cyan-400 transition-colors" />
              <div className="pointer-events-none absolute bottom-full right-0 mb-2 w-64 p-3 bg-zinc-900/90 backdrop-blur-md text-zinc-100 text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 leading-relaxed font-normal border border-zinc-700 transform translate-y-2 group-hover:translate-y-0">
                Determines specific heat of combustion (ΔHc), boiling points, and vapor density profiles used in VCE and BLEVE calculations.
              </div>
            </div>
          </label>
          <div className="relative">
            <select
              value={selectedHydrocarbon.id}
              onChange={handleHydrocarbonChange}
              className="w-full font-mono text-xs pl-3 pr-8 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700/50 rounded-lg text-zinc-800 dark:text-rose-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50 transition-all appearance-none shadow-inner"
            >
              {HYDROCARBONS.map((h) => (
                <option key={h.id} value={h.id} className="bg-zinc-900 text-zinc-200 font-sans">
                  {h.name} ({h.formula})
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-2.5 text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
            <div className="bg-zinc-50 dark:bg-zinc-950/30 p-2 rounded-md border border-zinc-100 dark:border-zinc-800/50 flex flex-col gap-0.5">
              <span className="text-[9px] uppercase tracking-wider opacity-70">Combustion</span> 
              <span className="font-bold text-zinc-700 dark:text-zinc-300">{selectedHydrocarbon.heatOfCombustion} MJ/kg</span>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-950/30 p-2 rounded-md border border-zinc-100 dark:border-zinc-800/50 flex flex-col gap-0.5">
              <span className="text-[9px] uppercase tracking-wider opacity-70">Boiling Pt</span> 
              <span className="font-bold text-zinc-700 dark:text-zinc-300">{selectedHydrocarbon.boilingPoint}°C</span>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-950/30 p-2 rounded-md border border-zinc-100 dark:border-zinc-800/50 flex flex-col gap-0.5">
              <span className="text-[9px] uppercase tracking-wider opacity-70">Liq Density</span> 
              <span className="font-bold text-zinc-700 dark:text-zinc-300">{selectedHydrocarbon.liquidDensity} kg/m³</span>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-950/30 p-2 rounded-md border border-zinc-100 dark:border-zinc-800/50 flex flex-col gap-0.5">
              <span className="text-[9px] uppercase tracking-wider opacity-70">Stoich Limit</span> 
              <span className="font-bold text-zinc-700 dark:text-zinc-300">{selectedHydrocarbon.stoichConc}% vol</span>
            </div>
          </div>
        </div>
      </div>
      </Accordion>

      <Accordion
        title="Physical Parameters"
        icon={<SlidersHorizontal className="w-4 h-4 text-cyan-500" />}
        defaultOpen
      >
      <div className="space-y-5">
        <div className="group/slider">
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              Equipment Vol (m³)
            </label>
            <input
              type="number"
              value={volume}
              min={0.1}
              max={100000}
              onChange={(e) => setVolume(Math.max(0.1, Number(e.target.value)))}
              className="w-24 bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-700/50 rounded-md px-2 py-1 text-[11px] text-right text-zinc-800 dark:text-cyan-400 focus:outline-none focus:border-cyan-500 font-mono transition-colors"
            />
          </div>
          <input
            type="range"
            min={0.1}
            max={selectedScenario.id === 'liquid_trapping' ? 5 : 20000}
            step={selectedScenario.id === 'liquid_trapping' ? 0.05 : 50}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-[9px] text-zinc-400 dark:text-zinc-500 mt-1 font-mono uppercase">
            <span>Min: 0.1</span>
            <span>Max: {selectedScenario.id === 'liquid_trapping' ? 5 : 20000}</span>
          </div>
        </div>

        {/* Fill Percent */}
        <div className="group/slider">
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <span>Liquid Fill (%)</span>
              <div className="group relative cursor-pointer">
                <HelpCircle className="w-3.5 h-3.5 text-zinc-400 hover:text-cyan-400 transition-colors" />
                <div className="pointer-events-none absolute bottom-full left-0 mb-2 w-64 p-3 bg-zinc-900/90 backdrop-blur-md text-zinc-100 text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 leading-relaxed font-normal border border-zinc-700 transform translate-y-2 group-hover:translate-y-0">
                  Critical parameter for under-loading. For VCEs, lower fill level leaves more vapor space, increasing available explosive vapor mass. For BLEVE, higher fill level increases liquid release inventory.
                </div>
              </div>
            </label>
            <input
              type="number"
              value={fillPercent}
              min={0}
              max={100}
              onChange={(e) => setFillPercent(Math.min(100, Math.max(0, Number(e.target.value))))}
              className="w-24 bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-700/50 rounded-md px-2 py-1 text-[11px] text-right text-zinc-800 dark:text-cyan-400 focus:outline-none focus:border-cyan-500 font-mono transition-colors"
            />
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={fillPercent}
            onChange={(e) => setFillPercent(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-[9px] text-zinc-400 dark:text-zinc-500 mt-1 font-mono uppercase">
            <span>0% (Empty)</span>
            <span>100% (Full)</span>
          </div>
        </div>

        {/* Operating Pressure */}
        <div className="group/slider">
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              Op/Rupture Pressure (bar)
            </label>
            <input
              type="number"
              value={pressure}
              min={0.01}
              max={500}
              step={0.1}
              onChange={(e) => setPressure(Math.max(0.01, Number(e.target.value)))}
              className="w-24 bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-700/50 rounded-md px-2 py-1 text-[11px] text-right text-zinc-800 dark:text-cyan-400 focus:outline-none focus:border-cyan-500 font-mono transition-colors"
            />
          </div>
          <input
            type="range"
            min={0.01}
            max={selectedScenario.id === 'liquid_trapping' ? 200 : 50}
            step={0.1}
            value={pressure}
            onChange={(e) => setPressure(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-[9px] text-zinc-400 dark:text-zinc-500 mt-1 font-mono uppercase">
            <span>0.01 bar</span>
            <span>Max: {selectedScenario.id === 'liquid_trapping' ? 200 : 50} bar</span>
          </div>
        </div>

        {/* Operating Temperature */}
        <div className="group/slider">
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <span>Op/Solar Temp (°C)</span>
              <div className="group relative cursor-pointer">
                <HelpCircle className="w-3.5 h-3.5 text-zinc-400 hover:text-cyan-400 transition-colors" />
                <div className="pointer-events-none absolute bottom-full left-0 mb-2 w-64 p-3 bg-zinc-900/90 backdrop-blur-md text-zinc-100 text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 leading-relaxed font-normal border border-zinc-700 transform translate-y-2 group-hover:translate-y-0">
                  Used to evaluate physical overpressure expansion and flashing dynamics. Liquids above boiling point flash instantly when pressure drops.
                </div>
              </div>
            </label>
            <input
              type="number"
              value={temp}
              min={-200}
              max={250}
              onChange={(e) => setTemp(Number(e.target.value))}
              className="w-24 bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-700/50 rounded-md px-2 py-1 text-[11px] text-right text-zinc-800 dark:text-cyan-400 focus:outline-none focus:border-cyan-500 font-mono transition-colors"
            />
          </div>
          <input
            type="range"
            min={-50}
            max={150}
            step={1}
            value={temp}
            onChange={(e) => setTemp(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-[9px] text-zinc-400 dark:text-zinc-500 mt-1 font-mono uppercase">
            <span>-50°C</span>
            <span>150°C</span>
          </div>
        </div>

        {/* Yield Factor */}
        <div className="group/slider">
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <span>Explosive Yield (%)</span>
              <div className="group relative cursor-pointer">
                <HelpCircle className="w-3.5 h-3.5 text-zinc-400 hover:text-cyan-400 transition-colors" />
                <div className="pointer-events-none absolute bottom-full left-0 mb-2 w-64 p-3 bg-zinc-900/90 backdrop-blur-md text-zinc-100 text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 leading-relaxed font-normal border border-zinc-700 transform translate-y-2 group-hover:translate-y-0">
                  TNT equivalent efficiency yield factor (typical values range between 3% and 10%). Corresponds to the fraction of release chemical energy converted to blast wave energy.
                </div>
              </div>
            </label>
            <input
              type="number"
              value={yieldPercent}
              min={1}
              max={30}
              step={0.5}
              onChange={(e) => setYieldPercent(Math.min(30, Math.max(1, Number(e.target.value))))}
              className="w-24 bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-700/50 rounded-md px-2 py-1 text-[11px] text-right text-zinc-800 dark:text-rose-400 focus:outline-none focus:border-rose-500 font-mono transition-colors"
            />
          </div>
          <input
            type="range"
            min={1}
            max={30}
            step={0.5}
            value={yieldPercent}
            onChange={(e) => setYieldPercent(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-[9px] text-zinc-400 dark:text-zinc-500 mt-1 font-mono uppercase">
            <span>Min: 1%</span>
            <span>Max: 30%</span>
          </div>
        </div>
      </div>
      </Accordion>

      <Accordion
        title="Atmospheric Conditions"
        icon={<CloudRain className="w-4 h-4 text-cyan-500" />}
        defaultOpen={false}
      >
      <div className="space-y-5">
        <div className="group/slider">
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              Ambient Temp (°C)
            </label>
            <input
              type="number"
              value={ambientTemp}
              min={-20}
              max={50}
              onChange={(e) => setAmbientTemp(Number(e.target.value))}
              className="w-24 bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-700/50 rounded-md px-2 py-1 text-[11px] text-right text-zinc-800 dark:text-cyan-400 focus:outline-none focus:border-cyan-500 font-mono transition-colors"
            />
          </div>
          <input
            type="range"
            min={-10}
            max={50}
            step={1}
            value={ambientTemp}
            onChange={(e) => setAmbientTemp(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-[9px] text-zinc-400 dark:text-zinc-500 mt-1 font-mono uppercase">
            <span>-10°C</span>
            <span>50°C</span>
          </div>
        </div>

        {/* Relative Humidity */}
        <div className="group/slider">
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <span>Relative Humidity (%)</span>
              <div className="group relative cursor-pointer">
                <HelpCircle className="w-3.5 h-3.5 text-zinc-400 hover:text-cyan-400 transition-colors" />
                <div className="pointer-events-none absolute bottom-full left-0 mb-2 w-64 p-3 bg-zinc-900/90 backdrop-blur-md text-zinc-100 text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 leading-relaxed font-normal border border-zinc-700 transform translate-y-2 group-hover:translate-y-0">
                  Used in BLEVE fireball thermal radiation calculations. High moisture levels absorb infrared thermal radiation, reducing heat flux at distance (Atmospheric Transmissivity).
                </div>
              </div>
            </label>
            <input
              type="number"
              value={humidity}
              min={0}
              max={100}
              onChange={(e) => setHumidity(Math.min(100, Math.max(0, Number(e.target.value))))}
              className="w-24 bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-700/50 rounded-md px-2 py-1 text-[11px] text-right text-zinc-800 dark:text-cyan-400 focus:outline-none focus:border-cyan-500 font-mono transition-colors"
            />
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={humidity}
            onChange={(e) => setHumidity(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-[9px] text-zinc-400 dark:text-zinc-500 mt-1 font-mono uppercase">
            <span>0% (Dry)</span>
            <span>100% (Saturated)</span>
          </div>
        </div>
      </div>
      </Accordion>

      <div className="bg-[var(--bg-primary)] rounded-xl p-3 flex items-start gap-2.5 text-xs text-[var(--text-secondary)] font-medium">
        <ShieldCheck className="w-4 h-4 flex-shrink-0 text-[var(--system-green)]" />
        <p>Physics engine active — threat vectors update in real time as you adjust parameters.</p>
      </div>
    </div>
  );
};
