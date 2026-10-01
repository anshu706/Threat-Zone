import type { SimulationResult, ScenarioPreset, IndianRegion } from '../types/physics';

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
  const encoded = btoa(JSON.stringify(state));
  const url = `${window.location.origin}${window.location.pathname}?scenario=${encoded}`;
  await navigator.clipboard.writeText(url);
}

export function parseScenarioFromUrl(): Record<string, unknown> | null {
  const param = new URLSearchParams(window.location.search).get('scenario');
  if (!param) return null;
  try {
    return JSON.parse(atob(param)) as Record<string, unknown>;
  } catch {
    return null;
  }
}
