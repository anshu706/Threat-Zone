export const SIMULATION_LIMITS = {
  volume: { min: 0.1, max: 20000 },
  fillPercent: { min: 0, max: 100 },
  pressure: { min: 0.01, max: 500 },
  temp: { min: -200, max: 250 },
  yieldPercent: { min: 1, max: 30 },
  ambientTemp: { min: -20, max: 50 },
  humidity: { min: 0, max: 100 },
  windSpeed: { min: 0, max: 60 },
  windDirection: { min: 0, max: 359 },
} as const;

export function clampFiniteNumber(value: number, min: number, max: number, fallback: number): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

export function parseBoundedNumber(
  rawValue: string,
  min: number,
  max: number,
  fallback: number
): number {
  const value = Number(rawValue);
  return clampFiniteNumber(value, min, max, fallback);
}

export function normalizeSimulationInputs(
  volume: number,
  fillPercent: number,
  pressure: number,
  temp: number,
  yieldPercent: number,
  ambientTemp: number,
  humidity: number
) {
  return {
    volume: clampFiniteNumber(volume, SIMULATION_LIMITS.volume.min, SIMULATION_LIMITS.volume.max, 1),
    fillPercent: clampFiniteNumber(fillPercent, SIMULATION_LIMITS.fillPercent.min, SIMULATION_LIMITS.fillPercent.max, 50),
    pressure: clampFiniteNumber(pressure, SIMULATION_LIMITS.pressure.min, SIMULATION_LIMITS.pressure.max, 1),
    temp: clampFiniteNumber(temp, SIMULATION_LIMITS.temp.min, SIMULATION_LIMITS.temp.max, 25),
    yieldPercent: clampFiniteNumber(yieldPercent, SIMULATION_LIMITS.yieldPercent.min, SIMULATION_LIMITS.yieldPercent.max, 5),
    ambientTemp: clampFiniteNumber(ambientTemp, SIMULATION_LIMITS.ambientTemp.min, SIMULATION_LIMITS.ambientTemp.max, 25),
    humidity: clampFiniteNumber(humidity, SIMULATION_LIMITS.humidity.min, SIMULATION_LIMITS.humidity.max, 50),
  };
}

export function normalizeWindInputs(windSpeed: number, windDirection: number) {
  return {
    windSpeed: clampFiniteNumber(
      windSpeed,
      SIMULATION_LIMITS.windSpeed.min,
      SIMULATION_LIMITS.windSpeed.max,
      15
    ),
    windDirection: clampFiniteNumber(
      windDirection,
      SIMULATION_LIMITS.windDirection.min,
      SIMULATION_LIMITS.windDirection.max,
      240
    ),
  };
}