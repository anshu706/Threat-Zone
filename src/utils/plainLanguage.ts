/** Short, plain descriptions for hazard zones */
export const BLAST_ZONE_PLAIN: Record<number, string> = {
  1: 'Buildings can collapse. Very high risk of death.',
  2: 'Major equipment damage and serious injuries.',
  3: 'Broken windows and moderate structural damage.',
  4: 'Safest distance — only minor effects expected.',
};

export const THERMAL_ZONE_PLAIN: Record<number, string> = {
  1: 'Deadly heat — burns in seconds.',
  2: 'Severe burns within 10 seconds.',
  3: 'Painful burns possible in 20 seconds.',
  4: 'Safe for people at this distance.',
};

export function getImpactAtCursor(psi: number, thermalKwM2: number, isBleve: boolean): string {
  if (isBleve && thermalKwM2 >= 37.5) return 'Fatal thermal exposure — immediate evacuation required.';
  if (isBleve && thermalKwM2 >= 12.5) return 'Serious burn risk — full PPE and minimum standoff.';
  if (psi >= 10) return 'Severe blast — structural collapse and fatality risk.';
  if (psi >= 4) return 'Serious overpressure — equipment failure and major injuries.';
  if (psi >= 1.5) return 'Moderate blast — window breakage and eardrum injury risk.';
  if (psi >= 0.3) return 'Minor blast effects — debris and glass hazard.';
  if (isBleve && thermalKwM2 >= 4) return 'Thermal discomfort — limit exposure time.';
  return 'Below major hazard thresholds at this point.';
}

export function getRiskSummary(tntMass: number, maxRadius: number): string {
  if (tntMass > 5000 || maxRadius > 500) {
    return 'Very high impact — large area affected.';
  }
  if (tntMass > 1000 || maxRadius > 200) {
    return 'High impact — evacuate beyond the outer zone.';
  }
  if (tntMass > 200 || maxRadius > 50) {
    return 'Moderate impact — follow site emergency plans.';
  }
  return 'Lower impact — still treat all zones with caution.';
}
