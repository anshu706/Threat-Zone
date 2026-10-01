import React from 'react';
import { Play, Eye } from 'lucide-react';

export interface ShowcaseProject {
  id: string;
  num: string;
  facility: string;
  regionId: string;
  scenarioId: string;
  title: string;
  type: string;
  subtitle: string;
  description: string;
  image: string;
  badge: string;
  telemetry: {
    label: string;
    value: string;
  }[];
  thresholds: {
    level: string;
    distance: string;
    impact: string;
  }[];
}

export const SHOWCASE_PROJECTS: ShowcaseProject[] = [
  {
    id: 'jamnagar-vce',
    num: '01',
    facility: 'Jamnagar Petrochemical Complex',
    regionId: 'jamnagar',
    scenarioId: 'sc-2',
    title: 'Vapor Cloud Explosion (VCE)',
    type: 'VCE Multi-Energy Model',
    subtitle: 'Primary Distillation & Congested Process Area Detonation',
    description:
      'Atmospheric catastrophic release of 50m³ pressurized LPG, prompt vapor dispersion under calm wind (2.5 m/s), and rapid flame front acceleration through densely congested process pipe-racks.',
    image: '/showcase/jamnagar.jpg',
    badge: 'Reliance Industries · Jamnagar, Gujarat',
    telemetry: [
      { label: 'Peak Overpressure', value: '8.2 PSI' },
      { label: 'TNT Equivalence', value: '2,400 kg' },
      { label: 'Mach Shock Speed', value: 'Mach 2.1' },
      { label: 'Evacuation Zone', value: '1,250 m' },
    ],
    thresholds: [
      { level: 'Z1 (8.0 PSI)', distance: '185 m', impact: 'Heavy steel destruction, tank rupture' },
      { level: 'Z2 (3.5 PSI)', distance: '340 m', impact: 'Reinforced concrete damage, serious injury' },
      { level: 'Z3 (1.0 PSI)', distance: '780 m', impact: 'Widespread window shatter, minor injuries' },
      { level: 'Z4 (0.5 PSI)', distance: '1,250 m', impact: 'Safe public boundary threshold' },
    ],
  },
  {
    id: 'mangalore-bleve',
    num: '02',
    facility: 'Mangalore Coastal Petrochemicals',
    regionId: 'mangalore',
    scenarioId: 'sc-1',
    title: 'Spherical BLEVE Fireball',
    type: 'BLEVE Thermal Model',
    subtitle: 'Pressurized LPG Spherical Vessel Thermal Rupture',
    description:
      'Boiling Liquid Expanding Vapor Explosion in a 2,000 m³ Horton sphere following sustained jet fire impingement. Yields massive atmospheric fireball and intense radiative heat flux.',
    image: '/showcase/bleve.jpg',
    badge: 'MRPL · Mangalore, Karnataka',
    telemetry: [
      { label: 'Fireball Diameter', value: '210 m' },
      { label: 'Burn Duration', value: '18.4 s' },
      { label: 'Peak Heat Flux', value: '37.5 kW/m²' },
      { label: '1% Lethality Radius', value: '480 m' },
    ],
    thresholds: [
      { level: '37.5 kW/m²', distance: '160 m', impact: '100% lethality in 10s, equipment damage' },
      { level: '12.5 kW/m²', distance: '320 m', impact: '1% lethality in 10s, 1st degree burns' },
      { level: '4.0 kW/m²', distance: '540 m', impact: 'Pain threshold within 20s' },
      { level: '1.6 kW/m²', distance: '920 m', impact: 'Safe public evacuation boundary' },
    ],
  },
  {
    id: 'kochi-jet',
    num: '03',
    facility: 'Kochi Offshore Marine Terminal',
    regionId: 'kochi',
    scenarioId: 'sc-3',
    title: 'High-Pressure Jet Fire',
    type: 'Jet Radiation Model',
    subtitle: 'Sonic Hydrocarbon Gas Release & Impingement',
    description:
      'Subsea pipeline and marine loading manifold failure under 65 bar operating pressure. Continuous sonic torch flame with directional radiative impingement on surrounding berthing arms.',
    image: '/showcase/kochi.jpg',
    badge: 'BPCL · Kochi Marine Terminal, Kerala',
    telemetry: [
      { label: 'Discharge Pressure', value: '65.0 Bar' },
      { label: 'Torch Flame Length', value: '85 m' },
      { label: 'Radiative Fraction', value: '0.28' },
      { label: 'Safe Marine Clearance', value: '620 m' },
    ],
    thresholds: [
      { level: 'Jet Core (>100 kW/m²)', distance: '85 m', impact: 'Immediate structural steel failure' },
      { level: 'Radiation Z1 (25 kW/m²)', distance: '190 m', impact: 'Vessel hull critical heating' },
      { level: 'Radiation Z2 (4.5 kW/m²)', distance: '380 m', impact: 'Emergency escape limit for crew' },
      { level: 'Radiation Z3 (1.6 kW/m²)', distance: '620 m', impact: 'Tug & support boat perimeter' },
    ],
  },
  {
    id: 'panipat-detonation',
    num: '04',
    facility: 'Panipat Naphtha Cracker Mega-Hub',
    regionId: 'panipat',
    scenarioId: 'sc-4',
    title: 'Confined Detonation Wave',
    type: 'DDT Confinement Model',
    subtitle: 'Pipe-Rack Deflagration-to-Detonation Transition',
    description:
      'High-confinement ethylene and propylene release within tightly nested heat exchanger trains. Rapid turbulence feedback triggers supersonic shock wave with secondary fragment throw.',
    image: '/showcase/panipat.jpg',
    badge: 'IOCL · Panipat, Haryana',
    telemetry: [
      { label: 'Confinement Level', value: 'Class 5 (Dense)' },
      { label: 'Shockwave Speed', value: '1,980 m/s' },
      { label: 'Reflection Factor', value: '2.8x' },
      { label: 'Structural Safe Zone', value: '1,420 m' },
    ],
    thresholds: [
      { level: 'Overpressure 12 PSI', distance: '140 m', impact: 'Catastrophic control room demolition' },
      { level: 'Overpressure 5.0 PSI', distance: '290 m', impact: 'Heavy process piping dislocation' },
      { level: 'Overpressure 1.5 PSI', distance: '650 m', impact: 'Substation & cladding collapse' },
      { level: 'Overpressure 0.5 PSI', distance: '1,420 m', impact: 'Offsite highway safe radius' },
    ],
  },
];

interface PinnedProjectShowcaseProps {
  onInspect: (project: ShowcaseProject) => void;
  onLaunchLive: (project: ShowcaseProject) => void;
}

export const PinnedProjectShowcase: React.FC<PinnedProjectShowcaseProps> = ({
  onInspect,
  onLaunchLive,
}) => {
  return (
    <div className="dh-showcase" id="scenarios">
      {SHOWCASE_PROJECTS.map((project) => (
        <section key={project.id} className="dh-sectionPin">
          <div className="dh-projectLink__wrap">
            {/* Background Cinematic Visual */}
            <div className="dh-projectLink__mediaWrap">
              <img
                src={project.image}
                alt={project.title}
                className="dh-projectLink__image"
                loading="lazy"
              />
              <div className="dh-projectLink__overlay" />
            </div>

            {/* Top Bar with Badge & Telemetry */}
            <div className="dh-projectLink__topBar">
              <div className="dh-projectLink__badge">
                <span className="dh-header__live-dot" />
                <span>{project.badge}</span>
              </div>

              <div className="dh-projectLink__telemetry-grid">
                {project.telemetry.map((t, i) => (
                  <div key={i} className="dh-projectLink__telemetry-item">
                    <span>{t.label}: </span>
                    <strong>{t.value}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Content Area */}
            <div className="dh-projectLink__content">
              <div className="dh-projectLink__index">
                {project.num} / SCENARIO ARCHIVE · {project.type}
              </div>
              <h2 className="dh-projectLink__title">{project.title}</h2>
              <p className="dh-projectLink__desc">{project.description}</p>

              <div className="dh-projectLink__actions">
                <button
                  type="button"
                  className="dh-btn-pill"
                  onClick={() => onLaunchLive(project)}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Run In Simulator
                </button>
                <button
                  type="button"
                  className="dh-btn-pill-ghost"
                  onClick={() => onInspect(project)}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Inspect Consequence Physics
                </button>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};
