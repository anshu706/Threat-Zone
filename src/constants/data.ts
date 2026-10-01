import type { Hydrocarbon, ScenarioPreset, Epicenter } from '../types/physics';

export const HYDROCARBONS: Hydrocarbon[] = [
  {
    id: 'methane',
    name: 'Methane',
    formula: 'CH₄',
    boilingPoint: -161.5,
    heatOfCombustion: 50.0, // MJ/kg
    liquidDensity: 422,     // kg/m³
    vaporDensity: 0.717,    // kg/m³ at STP
    stoichConc: 9.5,        // vol%
  },
  {
    id: 'propane',
    name: 'Propane',
    formula: 'C₃H₈',
    boilingPoint: -42.1,
    heatOfCombustion: 46.4, // MJ/kg
    liquidDensity: 493,     // kg/m³
    vaporDensity: 2.009,    // kg/m³ at STP
    stoichConc: 4.0,        // vol%
  },
  {
    id: 'gasoline',
    name: 'Gasoline',
    formula: 'C₅H₁₂ - C₈H₁₈',
    boilingPoint: 40.0,     // Average start bp
    heatOfCombustion: 44.0, // MJ/kg
    liquidDensity: 740,     // kg/m³
    vaporDensity: 3.4,      // kg/m³ at STP
    stoichConc: 1.8,        // vol%
  },
  {
    id: 'benzene',
    name: 'Benzene',
    formula: 'C₆H₆',
    boilingPoint: 80.1,
    heatOfCombustion: 40.1, // MJ/kg
    liquidDensity: 876,     // kg/m³
    vaporDensity: 3.25,     // kg/m³ at STP
    stoichConc: 2.7,        // vol%
  },
  {
    id: 'crude_oil',
    name: 'Crude Oil',
    formula: 'Complex Mix',
    boilingPoint: 150.0,
    heatOfCombustion: 42.0, // MJ/kg
    liquidDensity: 850,     // kg/m³
    vaporDensity: 4.5,      // kg/m³ at STP
    stoichConc: 1.5,        // vol%
  },
  {
    id: 'fuel_oil',
    name: 'Fuel Oil / Diesel',
    formula: 'C₁₂H₂₆ - C₂₀H₄₂',
    boilingPoint: 250.0,
    heatOfCombustion: 45.0, // MJ/kg
    liquidDensity: 840,     // kg/m³
    vaporDensity: 5.0,      // kg/m³ at STP
    stoichConc: 1.2,        // vol%
  }
];

export const SCENARIOS: ScenarioPreset[] = [
  {
    id: 'liquid_trapping',
    name: 'Liquid Trapping & Thermal Expansion',
    description: 'Liquid is trapped in a pipe section between two closed block valves. External solar heating or fire exposure causes thermal expansion. Since the liquid is incompressible, pressure rises rapidly (~10–15 bar/°C) until physical rupture occurs, releasing flashing superheated hydrocarbon.',
    type: 'OVERPRESSURE',
    materialId: 'propane',
    volumeDefault: 0.5,       // 500 liters of pipe space
    fillPercentDefault: 100,  // Completely full of liquid
    pressureDefault: 80,      // Rupture pressure in bar
    tempDefault: 45,          // Elevated temperature
    yieldDefault: 5,          // 5% VCE yield efficiency if vaporised
  },
  {
    id: 'underfilled_tank',
    name: 'Vapor Space Flammable Mixture (Under-Loaded Tank)',
    description: 'An atmospheric storage tank is under-loaded (low fill level), leaving a large vapor headspace. Failure of nitrogen blanketing or breathing valves allows air ingress, creating a highly flammable fuel-air mixture. A static spark or lightning strikes, igniting the vapor cloud internally.',
    type: 'VCE',
    materialId: 'gasoline',
    volumeDefault: 5000,      // 5,000 m³ tank volume
    fillPercentDefault: 10,   // Only 10% filled with liquid (90% vapor space)
    pressureDefault: 1.01,    // Atmospheric pressure
    tempDefault: 30,          // Ambient temperature
    yieldDefault: 10,         // Higher yield inside confined space
  },
  {
    id: 'vacuum_collapse',
    name: 'Over-Vacuum & Nitrogen Blanketing Loss',
    description: 'Rapid pump-out (unloading) combined with nitrogen blanketing control system failure causes tank pressure to drop below atmospheric (vacuum). The thin-walled tank collapses structurally. The sudden catastrophic structural failure shears piping, releasing the volatile inventory into a VCE.',
    type: 'VCE',
    materialId: 'crude_oil',
    volumeDefault: 10000,     // 10,000 m³ tank volume
    fillPercentDefault: 50,   // Half full when collapse occurs
    pressureDefault: 0.8,     // Under vacuum (0.8 bar absolute)
    tempDefault: 25,
    yieldDefault: 5,
  },
  {
    id: 'rapid_fill_static',
    name: 'Rapid Fill & Splash Loading Static Discharge',
    description: 'Pumping volatile fuel into an empty or under-loaded tank at high velocity causes splash loading, generating high static charge. The large vapor space contains a flammable mixture because the tank is mostly empty. The static charge discharges as a spark, igniting the vapor space.',
    type: 'VCE',
    materialId: 'benzene',
    volumeDefault: 2000,      // 2,000 m³ tank volume
    fillPercentDefault: 5,    // Very low initial fill level (95% vapor space)
    pressureDefault: 1.01,
    tempDefault: 25,
    yieldDefault: 8,
  },
  {
    id: 'pressurized_sphere_bleve',
    name: 'Pressurized Storage Sphere BLEVE',
    description: 'A pressurized hydrocarbon storage sphere (e.g. LPG) is exposed to external pool fire. The shell above the liquid level overheats and weakens. The vessel ruptures catastrophically. The pressurized liquid flashes instantly to vapor and aerosols, which ignite immediately, forming a massive fireball (BLEVE).',
    type: 'BLEVE',
    materialId: 'propane',
    volumeDefault: 1000,      // 1,000 m³ sphere volume
    fillPercentDefault: 70,   // 70% filled (700 m³ of liquid propane)
    pressureDefault: 12.0,    // Operating vapor pressure at ambient temp
    tempDefault: 35,          // High operating temp
    yieldDefault: 5,          // Blast yield factor
  }
];

export const DEFAULT_EPICENTER: Epicenter = {
  lat: 22.348, // Jamnagar Refinery, India
  lng: 69.873
};

export const BLAST_THRESHOLDS = [
  {
    zone: 1,
    label: 'Zone 1: Total Destruction',
    threshold: 0.7, // bar (side-on)
    thresholdPsi: 10.15,
    description: 'Total destruction of buildings and reinforced structures. Heavy structural damage. Severe injuries and high probability of fatalities.',
    color: '#EF4444',
    fillColor: 'rgba(239, 68, 68, 0.50)'
  },
  {
    zone: 2,
    label: 'Zone 2: Serious Damage',
    threshold: 0.3, // bar
    thresholdPsi: 4.35,
    description: 'Serious damage to process equipment and building structures. Collapse of steel structures. Eardrum rupture, serious injuries.',
    color: '#F59E0B',
    fillColor: 'rgba(245, 158, 11, 0.40)'
  },
  {
    zone: 3,
    label: 'Zone 3: Moderate Damage',
    threshold: 0.1, // bar
    thresholdPsi: 1.45,
    description: 'Moderate damage to masonry structures and light framing. Widespread window glass breakage and plaster damage. Eardrum injury risk.',
    color: '#10B981',
    fillColor: 'rgba(16, 185, 129, 0.30)'
  },
  {
    zone: 4,
    label: 'Zone 4: Safe Boundary',
    threshold: 0.02, // bar
    thresholdPsi: 0.29,
    description: 'Safe boundary. Minor window glass cracking. Minor injuries from flying debris only. Limit of thermal or structural hazard.',
    color: '#0284C7',
    fillColor: 'rgba(2, 132, 199, 0.20)'
  }
];

export const THERMAL_THRESHOLDS = [
  {
    zone: 1,
    label: 'Zone 1: Fatalities / Structural Failure',
    threshold: 37.5, // kW/m²
    description: 'Sufficient thermal energy to cause immediate fatalities. Plastic melts. Damage to process equipment and structural steel failure within minutes.',
    color: '#EF4444',
    fillColor: 'rgba(239, 68, 68, 0.50)'
  },
  {
    zone: 2,
    label: 'Zone 2: Serious Injury / 2nd Degree Burns',
    threshold: 12.5, // kW/m²
    description: 'Second-degree burns or worse in 10 seconds of exposure. Wood ignites with prolonged exposure. Serious injuries to personnel.',
    color: '#F59E0B',
    fillColor: 'rgba(245, 158, 11, 0.40)'
  },
  {
    zone: 3,
    label: 'Zone 3: Pain / 1st Degree Burns',
    threshold: 4.0, // kW/m²
    description: 'Causes pain and potential first-degree burns in 20 seconds. Safe limit for personnel emergency operations (with protective gear).',
    color: '#10B981',
    fillColor: 'rgba(16, 185, 129, 0.30)'
  },
  {
    zone: 4,
    label: 'Zone 4: Minor Discomfort / Safe Public Limit',
    threshold: 1.0, // kW/m²
    description: 'Safe boundary. Safe for long-term public exposure. Equivalent to solar radiation on a hot day.',
    color: '#0284C7',
    fillColor: 'rgba(2, 132, 199, 0.20)'
  }
];
