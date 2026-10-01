import React, { useEffect, useRef, useCallback, useState } from 'react';
import { MapContainer, TileLayer, Circle as LeafletCircle, Marker, Popup, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import gsap from 'gsap';
import type { SimulationResult, ScenarioPreset, IndianRegion } from '../types/physics';
import { getOverpressureAtDistance, getThermalFluxAtDistance } from '../utils/physics';
import { Crosshair, Map as MapIcon, Layers, Radio, Globe } from 'lucide-react';
import {
  DEFAULT_REGION,
  INDIAN_REGIONS,
  EARTH_SATELLITE_TILES,
  WORLD_MAP_CENTER,
  WORLD_MAP_ZOOM,
} from '../constants/regions';
import { MapRegionTooltip } from './MapRegionTooltip';
import { getImpactAtCursor } from '../utils/plainLanguage';

export interface MapLayers {
  blast: boolean;
  thermal: boolean;
  fragment: boolean;
}

const DEFAULT_LAYERS: MapLayers = { blast: true, thermal: true, fragment: false };

const ZONE_FILL: Record<number, number> = { 1: 0.5, 2: 0.4, 3: 0.3, 4: 0.2 };

const epicenterIcon = new L.DivIcon({
  className: 'custom-hazard-marker flex justify-center items-center',
  html: `<div class="relative flex justify-center items-center">
          <div class="pulse-ring"></div>
          <div class="pulse-core"></div>
         </div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const facilityIcon = new L.DivIcon({
  className: 'custom-facility-marker',
  html: '<div class="facility-dot"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

function MapViewSync({
  selectedRegion,
  worldView,
}: {
  selectedRegion: IndianRegion;
  worldView: boolean;
}) {
  const map = useMap();
  useEffect(() => {
    if (worldView) {
      map.flyTo(WORLD_MAP_CENTER, WORLD_MAP_ZOOM, { duration: 1.5, easeLinearity: 0.25 });
    } else {
      map.flyTo([selectedRegion.lat, selectedRegion.lng], selectedRegion.zoom, {
        duration: 1.8,
        easeLinearity: 0.25,
      });
    }
  }, [map, selectedRegion, worldView]);
  return null;
}

function MapResizeHandler() {
  const map = useMap();
  useEffect(() => {
    const onResize = () => map.invalidateSize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [map]);
  return null;
}

interface CursorMetrics {
  distanceM: number;
  bar: number;
  psi: number;
  thermal: number;
  impact: string;
}

function MapCursorTracker({
  epicenter,
  result,
  isBleve,
  ambientTemp,
  humidity,
  onMetrics,
}: {
  epicenter: [number, number];
  result: SimulationResult;
  isBleve: boolean;
  ambientTemp: number;
  humidity: number;
  onMetrics: (m: CursorMetrics | null) => void;
}) {
  const map = useMap();
  const origin = L.latLng(epicenter[0], epicenter[1]);

  useMapEvents({
    mousemove(e) {
      const distanceM = map.distance(origin, e.latlng);
      const { bar, psi, thermal } = getMapHoverMetrics(
        distanceM,
        result,
        isBleve,
        result.fireballDiameter,
        result.surfaceEmissivePower,
        ambientTemp,
        humidity
      );
      onMetrics({
        distanceM,
        bar,
        psi,
        thermal,
        impact: getImpactAtCursor(psi, thermal, isBleve),
      });
    },
    mouseout() {
      onMetrics(null);
    },
  });

  return null;
}

interface RiskMapProps {
  result: SimulationResult;
  selectedScenario: ScenarioPreset;
  selectedRegion: IndianRegion;
  darkMode: boolean;
  auditMode?: boolean;
  onSelectRegion?: (region: IndianRegion) => void;
  layers?: MapLayers;
  windDirection?: number;
  windSpeedKph?: number;
  ambientTemp?: number;
  humidity?: number;
  embedded?: boolean;
}

export const RiskMap: React.FC<RiskMapProps> = ({
  result,
  selectedScenario,
  selectedRegion = DEFAULT_REGION,
  auditMode = false,
  onSelectRegion,
  layers = DEFAULT_LAYERS,
  embedded = false,
  ambientTemp = 25,
  humidity = 50,
}) => {
  const isBleve = selectedScenario.type === 'BLEVE';
  const blastZones = result.overpressureZones;
  const thermalZones = result.thermalZones;
  const zonesToMap = isBleve && layers.thermal ? thermalZones : blastZones;
  const position: [number, number] = [selectedRegion.lat, selectedRegion.lng];
  const [worldView, setWorldView] = useState(false);
  const [cursorMetrics, setCursorMetrics] = useState<CursorMetrics | null>(null);

  useEffect(() => {
    setWorldView(false);
  }, [selectedRegion.id]);

  const viewportRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const xTo = useRef<gsap.QuickToFunc | undefined>(undefined);
  const yTo = useRef<gsap.QuickToFunc | undefined>(undefined);

  useEffect(() => {
    if (embedded || !viewportRef.current) return;
    xTo.current = gsap.quickTo(viewportRef.current, 'rotationY', { duration: 0.8, ease: 'power3' });
    yTo.current = gsap.quickTo(viewportRef.current, 'rotationX', { duration: 0.8, ease: 'power3' });
    gsap.set(viewportRef.current, { scale: 1.04, z: 20, transformPerspective: 1000 });
  }, [embedded]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (embedded || !containerRef.current || !xTo.current || !yTo.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      xTo.current(x * 12);
      yTo.current(18 - y * 12);
    },
    [embedded]
  );

  const handleMouseLeave = useCallback(() => {
    if (xTo.current && yTo.current) {
      xTo.current(0);
      yTo.current(18);
    }
  }, []);

  const otherRegions = INDIAN_REGIONS.filter((r) => r.id !== selectedRegion.id);
  const maxRadius = Math.max(...zonesToMap.map((z) => z.radius), 50);

  const renderZoneCircles = (zones: typeof blastZones, prefix: string) =>
    !worldView &&
    [...zones].reverse().map((zone, idx) => (
      <LeafletCircle
        key={`${prefix}-${zone.zone}-${selectedRegion.id}-${zone.radius}`}
        center={position}
        radius={zone.radius}
        pathOptions={{
          color: zone.color,
          fillColor: zone.color,
          fillOpacity: ZONE_FILL[zone.zone] ?? 0.2,
          weight: 2.5,
          dashArray: idx === 0 ? undefined : '6, 8',
          className: `zone-circle zone-circle-${zone.zone}`,
        }}
      />
    ));

  return (
    <div
      className={`map-panel map-panel-earth ${auditMode ? 'map-panel-audit' : ''} ${embedded ? 'map-panel-embedded' : ''}`}
    >
      {!embedded && (
        <div className="map-panel-header">
          <div className="flex items-center gap-3">
            <div className="map-panel-icon">
              <MapIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="map-panel-title">
                Threat matrix
                <span className="live-indicator" />
              </h2>
              <p className="map-panel-subtitle">India facilities · {selectedRegion.facility}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={`map-mode-badge map-mode-badge-btn ${worldView ? 'map-mode-badge-active' : ''}`}
              onClick={() => setWorldView(true)}
            >
              <Globe className="w-3 h-3" /> World
            </button>
            <span className="map-mode-badge"><Layers className="w-3 h-3" /> Satellite</span>
            <span className="map-mode-badge map-mode-badge-live">
              <Radio className="w-3 h-3 animate-pulse" /> LIVE
            </span>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className={`flex-1 ${embedded ? 'map-scene-flat' : 'map-3d-scene'}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {!embedded && <div className="map-3d-floor" />}
        <div ref={viewportRef} className={`${embedded ? 'map-flat-viewport' : 'map-3d-viewport map-glass-panel'}`}>
          <MapContainer
            center={embedded ? position : WORLD_MAP_CENTER}
            zoom={embedded ? selectedRegion.zoom : WORLD_MAP_ZOOM}
            style={{ width: '100%', height: '100%' }}
            zoomControl={!embedded}
            scrollWheelZoom
            minZoom={2}
            maxZoom={19}
            worldCopyJump
          >
            <MapViewSync selectedRegion={selectedRegion} worldView={embedded ? false : worldView} />
            <MapResizeHandler />
            {embedded && (
              <MapCursorTracker
                epicenter={position}
                result={result}
                isBleve={isBleve}
                ambientTemp={ambientTemp}
                humidity={humidity}
                onMetrics={setCursorMetrics}
              />
            )}
            <TileLayer attribution={EARTH_SATELLITE_TILES.attribution} url={EARTH_SATELLITE_TILES.url} maxZoom={19} />

            {!embedded &&
              otherRegions.map((region) => (
                <Marker
                  key={region.id}
                  position={[region.lat, region.lng]}
                  icon={facilityIcon}
                  eventHandlers={{
                    click: () => {
                      setWorldView(false);
                      onSelectRegion?.(region);
                    },
                  }}
                >
                  <Tooltip direction="top" offset={[0, -8]} opacity={1} className="map-region-tooltip" sticky>
                    <MapRegionTooltip region={region} />
                  </Tooltip>
                </Marker>
              ))}

            {layers.blast && renderZoneCircles(blastZones, 'blast')}
            {layers.thermal && isBleve && renderZoneCircles(thermalZones, 'thermal')}

            {layers.fragment && !worldView && (
              <LeafletCircle
                center={position}
                radius={maxRadius * 1.15}
                pathOptions={{
                  color: '#94a3b8',
                  fillColor: '#94a3b8',
                  fillOpacity: 0.05,
                  weight: 1,
                  dashArray: '4, 8',
                }}
              />
            )}

            <Marker position={position} icon={epicenterIcon}>
              <Tooltip direction="top" offset={[0, -14]} opacity={1} className="map-region-tooltip" sticky>
                <MapRegionTooltip region={selectedRegion} isActive />
              </Tooltip>
              <Popup className="map-region-popup">
                <div className="map-popup">
                  <h4><Crosshair className="w-3 h-3" /> Ground zero</h4>
                  <p className="map-popup-facility">{selectedRegion.facility}</p>
                  <p className="map-popup-scenario">{selectedScenario.name}</p>
                  <MapRegionTooltip region={selectedRegion} isActive />
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>

      {embedded && cursorMetrics && (
        <div className="ids-map-hud">
          <div className="ids-map-hud-row">
            <span className="ids-map-hud-label">Distance</span>
            <span className="ids-map-hud-value">
              {cursorMetrics.distanceM >= 1000
                ? `${(cursorMetrics.distanceM / 1000).toFixed(2)} km`
                : `${cursorMetrics.distanceM.toFixed(0)} m`}
            </span>
          </div>
          <div className="ids-map-hud-row">
            <span className="ids-map-hud-label">Overpressure</span>
            <span className="ids-map-hud-value">
              {cursorMetrics.psi.toFixed(2)} psi · {cursorMetrics.bar.toFixed(3)} bar
            </span>
          </div>
          {isBleve && cursorMetrics.thermal > 0 && (
            <div className="ids-map-hud-row">
              <span className="ids-map-hud-label">Thermal flux</span>
              <span className="ids-map-hud-value">{cursorMetrics.thermal.toFixed(1)} kW/m²</span>
            </div>
          )}
          <p className="ids-map-hud-impact">{cursorMetrics.impact}</p>
        </div>
      )}

      {!embedded && (
        <div className="map-legend">
          {zonesToMap.map((zone) => (
            <div key={zone.zone} className="map-legend-item">
              <span className="map-legend-dot" style={{ backgroundColor: zone.color }} />
              <span className="map-legend-label">Z{zone.zone}</span>
              <span className="map-legend-radius">{zone.radius}m</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/** Map hover readout helper for future HUD tooltip at cursor */
export function getMapHoverMetrics(
  distanceM: number,
  result: SimulationResult,
  isBleve: boolean,
  fireballDiameter: number,
  surfaceEmissivePower: number,
  ambientTemp: number,
  humidity: number
) {
  const bar = getOverpressureAtDistance(distanceM, result.tntMass);
  const psi = bar * 14.5038;
  const thermal =
    isBleve && fireballDiameter > 0
      ? getThermalFluxAtDistance(
          distanceM,
          fireballDiameter,
          surfaceEmissivePower,
          ambientTemp,
          humidity / 100
        )
      : 0;
  return { distanceM, bar, psi, thermal };
}
