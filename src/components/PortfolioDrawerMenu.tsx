import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';

export interface DrawerItem {
  id: string;
  num: string;
  name: string;
  type: 'facility' | 'scenario';
  regionId?: string;
  scenarioId?: string;
  category: string;
  image: string;
  metric: string;
  metricLabel: string;
  coordinates?: string;
  capacity?: string;
}

const DRAWER_ITEMS: DrawerItem[] = [
  {
    id: 'jamnagar',
    num: '01',
    name: 'Jamnagar Super-Refinery',
    type: 'facility',
    regionId: 'jamnagar',
    category: 'Reliance Industries · Refining & Petrochemicals',
    image: '/showcase/jamnagar.jpg',
    metric: '1,240,000 BPD',
    metricLabel: 'Crude Capacity',
    coordinates: '22.47°N 70.07°E',
    capacity: 'World largest single-site refinery',
  },
  {
    id: 'bleve-sphere',
    num: '02',
    name: 'BLEVE Fireball Dynamics',
    type: 'scenario',
    scenarioId: 'sc-1',
    category: 'Pressurized Hydrocarbon Sphere Catastrophe',
    image: '/showcase/bleve.jpg',
    metric: '37.5 kW/m²',
    metricLabel: 'Peak Thermal Flux',
    capacity: '2,000 m³ LPG Storage Vessel',
  },
  {
    id: 'kochi-terminal',
    num: '03',
    name: 'Kochi Marine Terminal',
    type: 'facility',
    regionId: 'kochi',
    category: 'Bharat Petroleum · Offshore Cryogenic Hub',
    image: '/showcase/kochi.jpg',
    metric: '310,000 BPD',
    metricLabel: 'Processing Rate',
    coordinates: '9.93°N 76.26°E',
    capacity: 'Offshore SPM & Jetty Berth',
  },
  {
    id: 'panipat-cracker',
    num: '04',
    name: 'Panipat Naphtha Cracker',
    type: 'facility',
    regionId: 'panipat',
    category: 'Indian Oil Corporation · Polymer Mega-Hub',
    image: '/showcase/panipat.jpg',
    metric: '857,000 TPA',
    metricLabel: 'Ethylene Output',
    coordinates: '29.39°N 76.96°E',
    capacity: 'Dedicated Process Pipe-Rack Hub',
  },
  {
    id: 'vce-cloud',
    num: '05',
    name: 'Vapor Cloud Detonation (VCE)',
    type: 'scenario',
    scenarioId: 'sc-2',
    category: 'TNO Multi-Energy Atmospheric Dispersion',
    image: '/showcase/jamnagar.jpg',
    metric: '8.2 PSI',
    metricLabel: 'Blast Wave Overpressure',
    capacity: '50 m³ Pressurized HC Flash',
  },
  {
    id: 'mangalore-complex',
    num: '06',
    name: 'Mangalore Petrochemicals',
    type: 'facility',
    regionId: 'mangalore',
    category: 'ONGC MRPL · Coastal Refining Center',
    image: '/showcase/bleve.jpg',
    metric: '300,000 BPD',
    metricLabel: 'Processing Volume',
    coordinates: '12.91°N 74.85°E',
    capacity: 'Hydrocracker & CCR Units',
  },
  {
    id: 'paradip-terminal',
    num: '07',
    name: 'Paradip Deep-Water Terminal',
    type: 'facility',
    regionId: 'paradip',
    category: 'IOCL · East Coast Energy Corridor',
    image: '/showcase/kochi.jpg',
    metric: '300,000 BPD',
    metricLabel: 'Crude Import Base',
    coordinates: '20.31°N 86.61°E',
    capacity: 'Deepwater Marine Terminals',
  },
];

interface PortfolioDrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFacility: (regionId: string) => void;
  onSelectScenario: (scenarioId: string) => void;
}

export const PortfolioDrawerMenu: React.FC<PortfolioDrawerMenuProps> = ({
  isOpen,
  onClose,
  onSelectFacility,
  onSelectScenario,
}) => {
  const [activeItem, setActiveItem] = useState<DrawerItem>(DRAWER_ITEMS[0]);

  const handleLaunch = (item: DrawerItem) => {
    if (item.type === 'facility' && item.regionId) {
      onSelectFacility(item.regionId);
    } else if (item.type === 'scenario' && item.scenarioId) {
      onSelectScenario(item.scenarioId);
    }
    onClose();
  };

  return (
    <div className={`dh-portfolioMenu ${isOpen ? 'active' : ''}`} aria-hidden={!isOpen}>
      <div className="dh-portfolioMenu__header">
        <div className="dh-header__logoWrap" onClick={onClose}>
          THREAT ZONE
          <span className="dh-header__logo-badge">
            <span className="dh-header__live-dot" />
            DIRECTORS & SCENARIOS
          </span>
        </div>

        <button type="button" className="dh-burger-btn" onClick={onClose} aria-label="Close menu">
          <span>Close</span>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="dh-portfolioMenu__inner">
        <div className="dh-portfolioMenu__listWrap">
          <div className="dh-portfolioMenu__listTitle">
            DIRECTORY · 10 INDIAN REFINERIES & CHEMICAL CONSEQUENCE MODELS
          </div>

          <ul className="dh-portfolioMenu__talentList">
            {DRAWER_ITEMS.map((item) => (
              <li
                key={item.id}
                className={`dh-portfolioMenu__talent ${activeItem.id === item.id ? 'active' : ''}`}
                onMouseEnter={() => setActiveItem(item)}
                onClick={() => handleLaunch(item)}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.2rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--mid)' }}>
                    {item.num}
                  </span>
                  <a
                    href="#simulator"
                    className="dh-portfolioMenu__talent__link"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLaunch(item);
                    }}
                  >
                    {item.name}
                  </a>
                </div>
                <span className="dh-portfolioMenu__talent__meta">{item.category}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Floating/Docked Preview Card (DreamHouse Signature) */}
        <div className="dh-portfolioMenu__previewWrap">
          <img
            src={activeItem.image}
            alt={activeItem.name}
            className="dh-portfolioMenu__previewImage"
          />
          <div className="dh-portfolioMenu__previewInfo">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--accent-amber)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {activeItem.type === 'facility' ? 'Critical Infrastructure' : 'Consequence Physics'}
            </span>
            <span style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.3rem', fontWeight: 600, color: '#ffffff' }}>
              {activeItem.name}
            </span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--mid)', textTransform: 'uppercase', display: 'block' }}>
                  {activeItem.metricLabel}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', fontWeight: 600, color: '#ffffff' }}>
                  {activeItem.metric}
                </span>
              </div>
              <button
                type="button"
                className="dh-btn-pill"
                style={{ padding: '0.4rem 0.9rem', fontSize: '0.72rem' }}
                onClick={() => handleLaunch(activeItem)}
              >
                Launch
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
