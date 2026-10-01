import type { SimulationResult, ScenarioPreset, IndianRegion } from '../types/physics';
import { HYDROCARBONS, SCENARIOS } from '../constants/data';
import { INDIAN_REGIONS } from '../constants/regions';
import { SIMULATION_LIMITS, clampFiniteNumber } from './security';

const MAX_SCENARIO_PARAM_LENGTH = 4096;
const SCENARIO_NUMBER_LIMITS = {
  volume: SIMULATION_LIMITS.volume,
  fillPercent: SIMULATION_LIMITS.fillPercent,
  pressure: SIMULATION_LIMITS.pressure,
  temp: SIMULATION_LIMITS.temp,
  yieldPercent: SIMULATION_LIMITS.yieldPercent,
  ambientTemp: SIMULATION_LIMITS.ambientTemp,
  humidity: SIMULATION_LIMITS.humidity,
  windSpeed: SIMULATION_LIMITS.windSpeed,
  windDirection: SIMULATION_LIMITS.windDirection,
} as const;

export async function copyScenarioSummary(
  result: SimulationResult,
  scenario: ScenarioPreset,
  region: IndianRegion
): Promise<void> {
  const maxBlast = Math.max(...result.overpressureZones.map((z) => z.radius), 0);
  const text = [
    `THREAT ZONE — Scenario Summary`,
    `Site: ${region.facility} (${region.name}, ${region.state})`,
    `Scenario: ${scenario.name} [${scenario.type}]`,
    `TNT Equivalent: ${result.tntTons.toFixed(3)} tons (${result.tntMass.toLocaleString()} kg)`,
    `Release Energy: ${result.blastEnergy.toLocaleString()} MJ`,
    `Safe Blast Boundary: ${maxBlast.toFixed(0)} m`,
    scenario.type === 'BLEVE'
      ? `Max Thermal Boundary: ${Math.max(...result.thermalZones.map((z) => z.radius), 0).toFixed(0)} m`
      : null,
    `Generated: ${new Date().toISOString()}`,
  ]
    .filter(Boolean)
    .join('\n');

  await navigator.clipboard.writeText(text);
}

export async function copyScenarioUrl(state: Record<string, unknown>): Promise<void> {
  const encoded = btoa(JSON.stringify(state))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
  if (encoded.length > MAX_SCENARIO_PARAM_LENGTH) {
    throw new Error('Scenario link is too large to share safely.');
  }
  const url = `${window.location.origin}${window.location.pathname}#scenario=${encoded}`;
  await navigator.clipboard.writeText(url);
}

export function parseScenarioFromUrl(): Record<string, unknown> | null {
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const param = hashParams.get('scenario') ?? new URLSearchParams(window.location.search).get('scenario');
  if (!param || param.length > MAX_SCENARIO_PARAM_LENGTH) return null;
  try {
    const normalized = param.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const parsed = JSON.parse(atob(padded)) as Record<string, unknown>;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;

    const allowedKeys = new Set([
      'view', 'scenarioId', 'regionId', 'materialId', 'volume', 'fillPercent',
      'pressure', 'temp', 'yieldPercent', 'ambientTemp', 'humidity',
      'windSpeed', 'windDirection',
    ]);
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (!allowedKeys.has(key)) continue;
      if (key === 'scenarioId' && typeof value === 'string' && SCENARIOS.some((item) => item.id === value)) {
        sanitized[key] = value;
        continue;
      }
      if (key === 'regionId' && typeof value === 'string' && INDIAN_REGIONS.some((item) => item.id === value)) {
        sanitized[key] = value;
        continue;
      }
      if (key === 'materialId' && typeof value === 'string' && HYDROCARBONS.some((item) => item.id === value)) {
        sanitized[key] = value;
        continue;
      }
      if (key === 'view' && (value === 'landing' || value === 'dashboard' || value === 'app')) {
        sanitized[key] = value;
        continue;
      }
      const limits = SCENARIO_NUMBER_LIMITS[key as keyof typeof SCENARIO_NUMBER_LIMITS];
      if (limits && typeof value === 'number') {
        sanitized[key] = clampFiniteNumber(value, limits.min, limits.max, limits.min);
      }
    }
    return sanitized;
  } catch {
    return null;
  }
}
