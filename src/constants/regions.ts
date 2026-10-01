import type { IndianRegion } from '../types/physics';

/** Major Indian oil & gas / petrochemical facilities — India only */
export const INDIAN_REGIONS: IndianRegion[] = [
  {
    id: 'jamnagar',
    name: 'Jamnagar',
    facility: 'Reliance Jamnagar Refinery Complex',
    state: 'Gujarat',
    type: 'Refinery',
    lat: 22.348,
    lng: 69.873,
    zoom: 14,
    operator: 'Reliance Industries',
    capacity: '1.4 MMbpd',
    workforceLive: 4280,
    weather: { tempC: 34, condition: 'Haze', humidity: 68, windKph: 14, icon: 'haze' },
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    facility: 'HPCL Mumbai Refinery',
    state: 'Maharashtra',
    type: 'Refinery',
    lat: 19.012,
    lng: 72.868,
    zoom: 14,
    operator: 'HPCL',
    capacity: '9.5 MMTPA',
    workforceLive: 3640,
    weather: { tempC: 31, condition: 'Humid', humidity: 82, windKph: 18, icon: 'cloud' },
  },
  {
    id: 'panipat',
    name: 'Panipat',
    facility: 'IOCL Panipat Refinery',
    state: 'Haryana',
    type: 'Refinery',
    lat: 29.316,
    lng: 76.968,
    zoom: 14,
    operator: 'Indian Oil',
    capacity: '15 MMTPA',
    workforceLive: 2180,
    weather: { tempC: 28, condition: 'Clear', humidity: 55, windKph: 10, icon: 'sun' },
  },
  {
    id: 'kochi',
    name: 'Kochi',
    facility: 'BPCL Kochi Refinery',
    state: 'Kerala',
    type: 'Refinery',
    lat: 9.968,
    lng: 76.245,
    zoom: 14,
    operator: 'BPCL',
    capacity: '15.5 MMTPA',
    workforceLive: 1920,
    weather: { tempC: 30, condition: 'Rain showers', humidity: 88, windKph: 22, icon: 'rain' },
  },
  {
    id: 'vizag',
    name: 'Visakhapatnam',
    facility: 'HPCL Visakh Refinery',
    state: 'Andhra Pradesh',
    type: 'Refinery',
    lat: 17.686,
    lng: 83.218,
    zoom: 14,
    operator: 'HPCL',
    capacity: '8.3 MMTPA',
    workforceLive: 1680,
    weather: { tempC: 32, condition: 'Partly cloudy', humidity: 75, windKph: 16, icon: 'cloud' },
  },
  {
    id: 'mathura',
    name: 'Mathura',
    facility: 'IOCL Mathura Refinery',
    state: 'Uttar Pradesh',
    type: 'Refinery',
    lat: 27.492,
    lng: 77.673,
    zoom: 14,
    operator: 'Indian Oil',
    capacity: '8 MMTPA',
    workforceLive: 1420,
    weather: { tempC: 29, condition: 'Clear', humidity: 48, windKph: 8, icon: 'sun' },
  },
  {
    id: 'hazira',
    name: 'Hazira',
    facility: 'ONGC Hazira LNG & Petrochemical Hub',
    state: 'Gujarat',
    type: 'LNG Terminal',
    lat: 21.133,
    lng: 72.652,
    zoom: 14,
    operator: 'ONGC / Shell',
    capacity: '5 MMTPA LNG',
    workforceLive: 980,
    weather: { tempC: 33, condition: 'Haze', humidity: 70, windKph: 15, icon: 'haze' },
  },
  {
    id: 'mangalore',
    name: 'Mangalore',
    facility: 'MRPL Mangalore Refinery',
    state: 'Karnataka',
    type: 'Refinery',
    lat: 12.914,
    lng: 74.856,
    zoom: 14,
    operator: 'MRPL / ONGC',
    capacity: '15 MMTPA',
    workforceLive: 1760,
    weather: { tempC: 29, condition: 'Cloudy', humidity: 85, windKph: 20, icon: 'cloud' },
  },
  {
    id: 'digboi',
    name: 'Digboi',
    facility: 'IOCL Digboi Refinery',
    state: 'Assam',
    type: 'Refinery',
    lat: 27.393,
    lng: 95.618,
    zoom: 14,
    operator: 'Indian Oil',
    capacity: '0.65 MMTPA',
    workforceLive: 420,
    weather: { tempC: 26, condition: 'Overcast', humidity: 92, windKph: 6, icon: 'cloud' },
  },
  {
    id: 'dahej',
    name: 'Dahej',
    facility: 'Dahej Petrochemical & Storage Complex',
    state: 'Gujarat',
    type: 'Petrochemical',
    lat: 21.708,
    lng: 72.578,
    zoom: 14,
    operator: 'GAIL / Reliance',
    capacity: 'Multi-product',
    workforceLive: 1580,
    weather: { tempC: 34, condition: 'Clear', humidity: 65, windKph: 13, icon: 'sun' },
  },
];

export const DEFAULT_REGION = INDIAN_REGIONS[0];

/** Default world view — full Earth, Indian facilities only */
export const WORLD_MAP_CENTER: [number, number] = [20, 0];
export const WORLD_MAP_ZOOM = 2;

/** Leaflet maxBounds — continental India + buffer (reference only; map is world-wide) */
export const INDIA_BOUNDS: [[number, number], [number, number]] = [
  [6.5, 68.0],
  [37.5, 97.5],
];

export function formatCoordinates(lat: number, lng: number): { lat: string; lng: string } {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  const latDeg = Math.floor(Math.abs(lat));
  const latMin = Math.floor((Math.abs(lat) - latDeg) * 60);
  const latSec = (((Math.abs(lat) - latDeg) * 60 - latMin) * 60).toFixed(1);
  const lngDeg = Math.floor(Math.abs(lng));
  const lngMin = Math.floor((Math.abs(lng) - lngDeg) * 60);
  const lngSec = (((Math.abs(lng) - lngDeg) * 60 - lngMin) * 60).toFixed(1);
  return {
    lat: `${latDir} ${latDeg}°${latMin}'${latSec}"`,
    lng: `${lngDir} ${lngDeg}°${lngMin}'${lngSec}"`,
  };
}

/** Esri World Imagery — natural green/blue satellite tiles */
export const EARTH_SATELLITE_TILES = {
  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  attribution:
    'Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics, USDA FSA, USGS, AeroGRID, IGN, IGP, and the GIS User Community',
};
