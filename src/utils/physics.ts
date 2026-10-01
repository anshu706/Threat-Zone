import type { Hydrocarbon, ScenarioPreset, SimulationResult, ZoneThreshold } from '../types/physics';
import { BLAST_THRESHOLDS, THERMAL_THRESHOLDS } from '../constants/data';

/**
 * Calculates the saturation vapor pressure of water at temperature T using Buck's equation
 * @param tempC Temperature in °C
 * @returns Saturation vapor pressure in Pascals (Pa)
 */
export function getWaterSaturationPressure(tempC: number): number {
  return 611.21 * Math.exp((17.67 * tempC) / (tempC + 243.5));
}

/**
 * Calculates the flash fraction of a pressurized liquid when released to atmospheric pressure
 * @param tempC Liquid temperature in °C
 * @param boilingPoint Boiling point of liquid in °C
 * @returns Flash fraction (0.0 to 1.0)
 */
export function getFlashFraction(tempC: number, boilingPoint: number): number {
  if (tempC <= boilingPoint) return 0;
  
  // Approximate properties for hydrocarbons:
  // Specific heat capacity Cp ~ 2.5 kJ/(kg·K)
  // Latent heat of vaporization ΔHv ~ 350 kJ/kg
  const cp = 2.5; 
  const deltaHv = 350;
  
  const fraction = (cp * (tempC - boilingPoint)) / deltaHv;
  return Math.min(1.0, Math.max(0.0, fraction));
}

/**
 * Computes physical gas expansion energy of a pressurized vessel rupture in Joules (pneumatic blast)
 * @param burstPressureBar Burst pressure in bar absolute
 * @param vaporVolumeM3 Gas space volume in m³
 * @param specificHeatRatio k (Cp/Cv, defaults to 1.3 for hydrocarbons)
 * @returns Energy in Joules
 */
export function getGasExpansionEnergy(
  burstPressureBar: number,
  vaporVolumeM3: number,
  specificHeatRatio = 1.3
): number {
  const pBurst = burstPressureBar * 1e5; // bar to Pa
  const pAmbient = 1.01325 * 1e5; // Pa
  const k = specificHeatRatio;

  if (pBurst <= pAmbient || vaporVolumeM3 <= 0) return 0;

  // Equation for expansion energy:
  // E = (P_burst * V / (k - 1)) * [1 - (P_ambient / P_burst)^((k-1)/k)]
  const term1 = (pBurst * vaporVolumeM3) / (k - 1);
  const term2 = 1 - Math.pow(pAmbient / pBurst, (k - 1) / k);
  
  return term1 * term2;
}

/**
 * Calculates side-on peak overpressure at a given distance using the Kinney-Graham formula
 * @param distanceM Standoff distance in meters
 * @param tntMassKg Equivalent TNT mass in kg
 * @returns Peak overpressure in bar
 */
export function getOverpressureAtDistance(distanceM: number, tntMassKg: number): number {
  if (tntMassKg <= 0 || distanceM <= 0) return 0;

  const pAmbientBar = 1.01325;
  // Scaled distance Z = R / W^(1/3)
  const z = distanceM / Math.pow(tntMassKg, 1 / 3);

  // Kinney-Graham formula:
  // Ps/P0 = 808 * (1 + (Z/4.5)^2) / ( sqrt(1 + (Z/0.048)^2) * sqrt(1 + (Z/0.32)^2) * sqrt(1 + (Z/1.35)^2) )
  const num = 808 * (1 + Math.pow(z / 4.5, 2));
  const den = 
    Math.sqrt(1 + Math.pow(z / 0.048, 2)) *
    Math.sqrt(1 + Math.pow(z / 0.32, 2)) *
    Math.sqrt(1 + Math.pow(z / 1.35, 2));

  const psOverP0 = num / den;
  return psOverP0 * pAmbientBar;
}

/**
 * Finds the distance (meters) corresponding to a target overpressure using binary search
 */
export function findRadiusForOverpressure(targetOverpressureBar: number, tntMassKg: number): number {
  if (tntMassKg <= 0 || targetOverpressureBar <= 0) return 0;

  let low = 0.1;
  let high = 100000.0; // 100 km limit
  let result = 0.1;

  for (let i = 0; i < 60; i++) {
    const mid = (low + high) / 2;
    const op = getOverpressureAtDistance(mid, tntMassKg);

    if (op >= targetOverpressureBar) {
      result = mid;
      low = mid; // Overpressure is too high, go further out
    } else {
      high = mid; // Overpressure is too low, search closer in
    }
  }

  return result;
}

/**
 * Calculates radiant heat flux at a target distance from a BLEVE fireball
 * @param distanceM Standoff distance from center of fireball (meters)
 * @param fireballDiameterM Maximum fireball diameter (meters)
 * @param surfaceEmissivePowerKwM2 Surface emissive power of fireball (kW/m²)
 * @param tempC Ambient temperature (°C)
 * @param relHumidity Fraction relative humidity (0.0 to 1.0)
 * @returns Radiant heat flux in kW/m²
 */
export function getThermalFluxAtDistance(
  distanceM: number,
  fireballDiameterM: number,
  surfaceEmissivePowerKwM2: number,
  tempC: number,
  relHumidity: number
): number {
  const rFireball = fireballDiameterM / 2;
  if (distanceM <= 0 || rFireball <= 0) return 0;

  // 1. Geometric view factor F
  // For a sphere, if we are inside the fireball, view factor is 1.0.
  // Otherwise, F = R_fireball^2 / distance^2 = D^2 / (4 * distance^2)
  let f = 1.0;
  if (distanceM > rFireball) {
    f = (fireballDiameterM * fireballDiameterM) / (4 * distanceM * distanceM);
  }

  // 2. Atmospheric Transmissivity tau_a
  let tau = 1.0;
  if (distanceM > rFireball) {
    const pSat = getWaterSaturationPressure(tempC);
    const pWater = relHumidity * pSat; // Pa
    const pathLength = distanceM - rFireball;

    // CCPS transmissivity formula: τ = 2.02 * [P_w * (x - D/2)]^-0.09
    if (pWater > 0 && pathLength > 0) {
      const term = pWater * pathLength;
      tau = 2.02 * Math.pow(term, -0.09);
      // Cap/clamp transmissivity to realistic limits (0.1 to 1.0)
      tau = Math.min(1.0, Math.max(0.1, tau));
    }
  }

  return surfaceEmissivePowerKwM2 * f * tau;
}

/**
 * Finds the distance (meters) corresponding to a target radiant heat flux using binary search
 */
export function findRadiusForThermalFlux(
  targetFluxKwM2: number,
  fireballDiameterM: number,
  surfaceEmissivePowerKwM2: number,
  tempC: number,
  relHumidity: number
): number {
  const rFireball = fireballDiameterM / 2;
  if (fireballDiameterM <= 0 || surfaceEmissivePowerKwM2 <= 0 || targetFluxKwM2 <= 0) return 0;

  // If even at the surface of the fireball the flux is less than the target, radius is at fireball boundary
  const surfaceFlux = surfaceEmissivePowerKwM2; // At surface, F = 1, tau = 1
  if (surfaceFlux <= targetFluxKwM2) return rFireball;

  let low = rFireball;
  let high = 100000.0; // 100 km
  let result = rFireball;

  for (let i = 0; i < 60; i++) {
    const mid = (low + high) / 2;
    const flux = getThermalFluxAtDistance(mid, fireballDiameterM, surfaceEmissivePowerKwM2, tempC, relHumidity);

    if (flux >= targetFluxKwM2) {
      result = mid;
      low = mid; // Too hot, search further out
    } else {
      high = mid; // Too cold, search closer in
    }
  }

  return result;
}

/**
 * Main calculation entry point
 */
export function runSimulation(
  scenario: ScenarioPreset,
  hydrocarbon: Hydrocarbon,
  volumeM3: number,
  fillPercent: number,
  pressureBar: number,
  tempC: number,
  yieldPercent: number,
  ambientTempC = 25,
  humidityPercent = 50
): SimulationResult {
  const yieldFraction = yieldPercent / 100;
  const rhFraction = humidityPercent / 100;
  const fillFraction = fillPercent / 100;
  
  const vaporVolume = volumeM3 * (1 - fillFraction);
  const liquidVolume = volumeM3 * fillFraction;

  let fuelMassInvolved = 0;
  let tntMass = 0;
  let physicalEnergyJ = 0;

  // BLEVE fireball details
  let fireballDiameter = 0;
  let fireballDuration = 0;
  let surfaceEmissivePower = 0;

  // Specific heat ratio k for hydrocarbons
  const k = 1.3;
  const eTnt = 4.68; // MJ/kg
  const eTntJ = eTnt * 1e6; // J/kg

  // 1. Calculate Fuel Mass and Explosion Energies based on scenario type
  if (scenario.id === 'liquid_trapping') {
    // Liquid trapped in pipe. Liquid density is used.
    // Total trapped mass
    const liquidMass = liquidVolume * hydrocarbon.liquidDensity;
    
    // Physical explosion: liquid expansion & flashing
    // Rupture of piping can be approximated by gas expansion formula using the tiny vapor pocket
    // or treating liquid expansion as high pressure release. Let's compute physical energy of the vapor space 
    // + liquid flash fraction:
    const flashFraction = getFlashFraction(tempC, hydrocarbon.boilingPoint);
    const flashedMass = liquidMass * flashFraction;
    
    fuelMassInvolved = flashedMass; // Flashed mass forms the vapor cloud VCE

    // Physical rupture energy:
    const gasSpaceVol = Math.max(0.001, vaporVolume); // small pocket
    physicalEnergyJ = getGasExpansionEnergy(pressureBar, gasSpaceVol, k);
    
    const physicalTnt = physicalEnergyJ / eTntJ;
    // VCE of flashed vapor:
    const chemicalTnt = (yieldFraction * fuelMassInvolved * hydrocarbon.heatOfCombustion) / eTnt;
    
    tntMass = physicalTnt + chemicalTnt;

  } else if (scenario.id === 'underfilled_tank' || scenario.id === 'rapid_fill_static') {
    // Vapor space filled with stoichiometric mixture
    // Mass of fuel = Vapor space volume * Stoichiometric concentration * Vapor density
    const stoichFraction = hydrocarbon.stoichConc / 100;
    const fuelVaporVol = vaporVolume * stoichFraction;
    fuelMassInvolved = fuelVaporVol * hydrocarbon.vaporDensity;

    // Confinement within tank: VCE calculation
    tntMass = (yieldFraction * fuelMassInvolved * hydrocarbon.heatOfCombustion) / eTnt;

  } else if (scenario.id === 'vacuum_collapse') {
    // Vacuum collapse. Releasing fuel.
    // Mass released: vapor space vapor + 5% liquid aerosolization
    const stoichFraction = hydrocarbon.stoichConc / 100;
    const vaporMass = vaporVolume * stoichFraction * hydrocarbon.vaporDensity;
    const liquidMass = liquidVolume * hydrocarbon.liquidDensity;
    fuelMassInvolved = vaporMass + 0.05 * liquidMass;

    // VCE on collapse
    tntMass = (yieldFraction * fuelMassInvolved * hydrocarbon.heatOfCombustion) / eTnt;

  } else if (scenario.type === 'BLEVE') {
    // Boiling Liquid Expanding Vapor Explosion
    // Involved mass is the total liquid mass inside sphere
    const liquidMass = liquidVolume * hydrocarbon.liquidDensity;
    fuelMassInvolved = liquidMass;

    // Fireball radiation parameters:
    fireballDiameter = 7.93 * Math.pow(fuelMassInvolved, 1 / 3);
    
    if (fuelMassInvolved <= 30000) {
      fireballDuration = 0.45 * Math.pow(fuelMassInvolved, 1 / 3);
    } else {
      fireballDuration = 2.6 * Math.pow(fuelMassInvolved, 1 / 6);
    }

    // Radiation fraction for fireballs (usually ~25-35%, let's use 30%)
    const radiationFraction = 0.30;
    // SEP (kW/m²): Es = (η_rad * M_liquid * ΔHc * 1000) / (π * D² * tc)
    const surfaceArea = Math.PI * fireballDiameter * fireballDiameter;
    if (surfaceArea > 0 && fireballDuration > 0) {
      surfaceEmissivePower = (radiationFraction * fuelMassInvolved * hydrocarbon.heatOfCombustion * 1000) / (surfaceArea * fireballDuration);
    }

    // BLEVE blast overpressure:
    // CCPS uses a portion of liquid heat energy flashing as blast wave.
    // Standard VCE equivalence is applied with yieldPercent on the flashing liquid mass
    const flashFraction = getFlashFraction(tempC, hydrocarbon.boilingPoint);
    const flashingMass = fuelMassInvolved * flashFraction;
    
    // Physical energy of pressurized vapor space:
    physicalEnergyJ = getGasExpansionEnergy(pressureBar, Math.max(0.1, vaporVolume), k);
    const physicalTnt = physicalEnergyJ / eTntJ;
    
    // Chemical blast from flashing fuel:
    const chemicalTnt = (yieldFraction * flashingMass * hydrocarbon.heatOfCombustion) / eTnt;
    
    tntMass = physicalTnt + chemicalTnt;

  } else {
    // Fallback/standard VCE of vapor space
    const stoichFraction = hydrocarbon.stoichConc / 100;
    fuelMassInvolved = vaporVolume * stoichFraction * hydrocarbon.vaporDensity;
    tntMass = (yieldFraction * fuelMassInvolved * hydrocarbon.heatOfCombustion) / eTnt;
  }

  // Ensure minimum limits
  tntMass = Math.max(0.001, tntMass);
  const blastEnergy = tntMass * eTnt; // MJ
  const tntTons = tntMass / 1000;    // Tons of TNT

  // 2. Compute Overpressure Zone Radii
  const overpressureZones: ZoneThreshold[] = BLAST_THRESHOLDS.map((zoneDef) => {
    const radius = findRadiusForOverpressure(zoneDef.threshold, tntMass);
    return {
      ...zoneDef,
      radius: Math.round(radius * 10) / 10 // Round to 1 decimal place
    };
  });

  // 3. Compute BLEVE Thermal Radiation Zone Radii
  let thermalZones: ZoneThreshold[] = [];
  if (scenario.type === 'BLEVE' && fireballDiameter > 0 && surfaceEmissivePower > 0) {
    thermalZones = THERMAL_THRESHOLDS.map((zoneDef) => {
      const radius = findRadiusForThermalFlux(
        zoneDef.threshold,
        fireballDiameter,
        surfaceEmissivePower,
        ambientTempC,
        rhFraction
      );
      return {
        ...zoneDef,
        radius: Math.round(radius * 10) / 10
      };
    });
  }

  return {
    tntMass: Math.round(tntMass * 100) / 100,
    blastEnergy: Math.round(blastEnergy * 100) / 100,
    tntTons: Math.round(tntTons * 10000) / 10000,
    fireballDiameter: Math.round(fireballDiameter * 10) / 10,
    fireballDuration: Math.round(fireballDuration * 10) / 10,
    surfaceEmissivePower: Math.round(surfaceEmissivePower * 10) / 10,
    overpressureZones,
    thermalZones,
    fuelMassInvolved: Math.round(fuelMassInvolved * 100) / 100
  };
}
