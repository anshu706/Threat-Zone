import React from 'react';
import type { IndianRegion } from '../types/physics';
import { Cloud, CloudRain, CloudSun, Sun, Wind, Users, Droplets } from 'lucide-react';

const WEATHER_ICONS = {
  sun: Sun,
  cloud: Cloud,
  rain: CloudRain,
  haze: CloudSun,
  storm: CloudRain,
} as const;

interface MapRegionTooltipProps {
  region: IndianRegion;
  isActive?: boolean;
}

export const MapRegionTooltip: React.FC<MapRegionTooltipProps> = ({ region, isActive }) => {
  const WeatherIcon = WEATHER_ICONS[region.weather.icon];

  return (
    <div className={`map-region-tooltip-inner ${isActive ? 'map-region-tooltip-active' : ''}`}>
      <p className="map-region-tooltip-title">{region.name}</p>
      <p className="map-region-tooltip-facility">{region.facility}</p>

      <div className="map-region-tooltip-row">
        <WeatherIcon className="map-region-tooltip-icon" />
        <span>
          {region.weather.tempC}°C · {region.weather.condition}
        </span>
      </div>

      <div className="map-region-tooltip-row">
        <Droplets className="map-region-tooltip-icon" />
        <span>Humidity {region.weather.humidity}%</span>
        <Wind className="map-region-tooltip-icon" />
        <span>{region.weather.windKph} km/h</span>
      </div>

      <div className="map-region-tooltip-row map-region-tooltip-workforce">
        <Users className="map-region-tooltip-icon" />
        <span>
          <strong>{region.workforceLive.toLocaleString()}</strong> on shift · live
        </span>
      </div>
    </div>
  );
};
