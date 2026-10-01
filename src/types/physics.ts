export interface Hydrocarbon {
  id: string;
  name: string;
  formula: string;
  boilingPoint: number;       // in °C
  heatOfCombustion: number;   // in MJ/kg (ΔHc)
  liquidDensity: number;      // in kg/m³
  vaporDensity: number;       // in kg/m³ at STP
  stoichConc: number;         // Stoichiometric concentration in air (vol%)
}

export type ScenarioType = 'VCE' | 'BLEVE' | 'OVERPRESSURE';

export interface ScenarioPreset {
  id: string;
  name: string;
  description: string;
  type: ScenarioType;
  materialId: string;
  volumeDefault: number;      // in m³
  fillPercentDefault: number; // in %
  pressureDefault: number;    // in bar
  tempDefault: number;        // in °C
  yieldDefault: number;       // in %
}

export interface Epicenter {
  lat: number;
  lng: number;
}

export interface RegionWeather {
  tempC: number;
  condition: string;
  humidity: number;
  windKph: number;
  icon: 'sun' | 'cloud' | 'rain' | 'haze' | 'storm';
}

export interface IndianRegion {
  id: string;
  name: string;
  facility: string;
  state: string;
  type: 'Refinery' | 'Petrochemical' | 'LNG Terminal' | 'Storage Hub';
  lat: number;
  lng: number;
  zoom: number;
  operator: string;
  capacity?: string;
  workforceLive: number;
  weather: RegionWeather;
}

export interface ZoneThreshold {
  zone: number;
  label: string;
  threshold: number;         // bar for blast, kW/m² for thermal
  thresholdPsi?: number;     // PSI for blast
  description: string;
  radius: number;            // calculated radius in meters
  color: string;
  fillColor: string;
}

export interface SimulationResult {
  tntMass: number;           // kg of TNT equivalent
  blastEnergy: number;       // MJ of total energy
  tntTons: number;           // Tons of TNT equivalent
  fireballDiameter: number;  // meters (BLEVE only)
  fireballDuration: number;  // seconds (BLEVE only)
  surfaceEmissivePower: number; // kW/m² (BLEVE only)
  overpressureZones: ZoneThreshold[];
  thermalZones: ZoneThreshold[];
  fuelMassInvolved: number;  // kg
}
