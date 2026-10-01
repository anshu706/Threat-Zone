/**
 * RiskMap3D — Deck.gl + MapLibre GL powered 3D consequence map.
 *
 * Renders threat zones as 3D extruded cylinders (ColumnLayer) over a real
 * satellite or tactical dark base map. Full pitch/bearing/altitude controls provide
 * an immersive tactical birds-eye consequence model.
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Map from 'react-map-gl/maplibre';
import DeckGL from '@deck.gl/react';
import {
  ColumnLayer,
  ScatterplotLayer,
  ArcLayer,
} from '@deck.gl/layers';
import type { PickingInfo } from '@deck.gl/core';
import 'maplibre-gl/dist/maplibre-gl.css';

import {
  Map as MapIcon,
  Layers,
  Radio,
  Globe,
  Crosshair,
  Maximize2,
  Compass,
  Eye,
  RotateCw,
  RotateCcw,
  Sun,
  Moon,
} from 'lucide-react';
import type { SimulationResult, ScenarioPreset, IndianRegion } from '../types/physics';
import { INDIAN_REGIONS, DEFAULT_REGION, formatCoordinates } from '../constants/regions';

/* ─── Types ────────────────────────────────────────────────────────────── */
export interface MapLayers {
  blast: boolean;
  thermal: boolean;
  fragment: boolean;
}

const DEFAULT_LAYERS: MapLayers = { blast: true, thermal: true, fragment: false };

interface RiskMap3DProps {
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

/* ─── Zone color → [r,g,b,a] ───────────────────────────────────────────── */
function hexToRgba(hex: string, alpha = 180): [number, number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
    alpha,
  ];
}

/* ─── Main Component ─────────────────────────────────────────────────────*/
export const RiskMap3D: React.FC<RiskMap3DProps> = ({
  result,
  selectedScenario,
  selectedRegion = DEFAULT_REGION,
  onSelectRegion,
  layers = DEFAULT_LAYERS,
  embedded = false,
  ambientTemp: _ambientTemp = 25,
  humidity: _humidity = 50,
  windDirection = 240,
}) => {
  const isBleve = selectedScenario.type === 'BLEVE';
  const blastZones = result.overpressureZones;
  const thermalZones = result.thermalZones;
  const zonesToMap = isBleve && layers.thermal ? thermalZones : blastZones;

  const [worldView, setWorldView] = useState(false);
  const [mapTheme, setMapTheme] = useState<'satellite' | 'dark'>('satellite');
  const [hoveredInfo, setHoveredInfo] = useState<{ zone: number; label: string; radius: number } | null>(null);

  /* ── Interactive 3D Camera View State ────────────────────────────── */
  const [viewState, setViewState] = useState({
    longitude: selectedRegion.lng,
    latitude: selectedRegion.lat,
    zoom: selectedRegion.zoom - 1.5,
    pitch: 58,
    bearing: -22,
    maxPitch: 85,
    minZoom: 2,
    maxZoom: 20,
  });

  /* Sync camera on region or world view change */
  useEffect(() => {
    if (worldView) {
      setViewState((prev) => ({
        ...prev,
        longitude: 78.9629,
        latitude: 22.5937,
        zoom: 4.2,
        pitch: 25,
        bearing: 0,
      }));
    } else {
      setViewState((prev) => ({
        ...prev,
        longitude: selectedRegion.lng,
        latitude: selectedRegion.lat,
        zoom: selectedRegion.zoom - 1.5,
        pitch: 58,
        bearing: -22,
      }));
    }
  }, [selectedRegion, worldView]);

  /* ── Blast/thermal zone ColumnLayer data (Extruded 3D Cylinders) ── */
  const zoneColumnData = useMemo(() => {
    if (!result || zonesToMap.length === 0) return [];
    const sorted = [...zonesToMap].sort((a, b) => b.radius - a.radius);
    const maxRadius = sorted[0].radius;
    return sorted.map((zone) => ({
      position: [selectedRegion.lng, selectedRegion.lat] as [number, number],
      radius: zone.radius,
      /** Height proportional to hazard severity — inner critical zones are highest */
      elevation: Math.max(350, ((maxRadius - zone.radius) / maxRadius) * 7500 + 500),
      color: hexToRgba(zone.color, zone.zone === 1 ? 210 : zone.zone === 2 ? 170 : 130),
      zone: zone.zone,
      label: zone.label,
    }));
  }, [result, zonesToMap, selectedRegion]);

  /* ── Epicenter pulse ring ─────────────────────────────────────────── */
  const epicenterData = useMemo(() => [{
    position: [selectedRegion.lng, selectedRegion.lat] as [number, number],
    radius: 120,
    color: [255, 60, 30, 255] as [number, number, number, number],
  }], [selectedRegion]);

  /* ── Facility markers (other regions in India) ───────────────────── */
  const facilityData = useMemo(() =>
    INDIAN_REGIONS
      .filter((r) => r.id !== selectedRegion.id)
      .map((r) => ({
        position: [r.lng, r.lat] as [number, number],
        radius: worldView ? 16000 : 7000,
        color: [140, 200, 255, 200] as [number, number, number, number],
        region: r,
      })),
    [selectedRegion.id, worldView]
  );

  /* ── Wind dispersion arc (3D trajectory) ─────────────────────────── */
  const windArcData = useMemo(() => {
    if (worldView || !layers.blast) return [];
    const maxR = Math.max(...blastZones.map((z) => z.radius), 100);
    const angleRad = ((windDirection - 90) * Math.PI) / 180;
    const R = 6371000;
    const dLat = ((maxR * 1.5) * Math.cos(angleRad)) / R;
    const dLng = ((maxR * 1.5) * Math.sin(angleRad)) / (R * Math.cos((selectedRegion.lat * Math.PI) / 180));
    return [{
      from: { coordinates: [selectedRegion.lng, selectedRegion.lat] },
      to: {
        coordinates: [
          selectedRegion.lng + (dLng * 180) / Math.PI,
          selectedRegion.lat + (dLat * 180) / Math.PI,
        ],
      },
      color: [255, 210, 60, 200] as [number, number, number, number],
    }];
  }, [blastZones, selectedRegion, windDirection, worldView, layers.blast]);

  /* ── Fragment scatter boundary ring ──────────────────────────────── */
  const fragmentData = useMemo(() => {
    if (!layers.fragment || worldView || blastZones.length === 0) return [];
    const maxR = Math.max(...blastZones.map((z) => z.radius));
    return [{ position: [selectedRegion.lng, selectedRegion.lat] as [number, number], radius: maxR * 1.15 }];
  }, [layers.fragment, blastZones, selectedRegion, worldView]);

  /* ── DeckGL 3D Layers ────────────────────────────────────────────── */
  const deckLayers = useMemo(() => {
    const lyrs = [];

    /* Fragment scatter ring */
    if (fragmentData.length > 0) {
      lyrs.push(
        new ScatterplotLayer({
          id: 'fragment-ring',
          data: fragmentData,
          getPosition: (d) => d.position,
          getRadius: (d) => d.radius,
          getFillColor: [148, 163, 184, 25],
          getLineColor: [148, 163, 184, 120],
          lineWidthMinPixels: 1.5,
          stroked: true,
          filled: true,
          radiusUnits: 'meters',
        })
      );
    }

    /* 3D Extruded Consequence Columns (true volumetric 3D zones) */
    if (layers.blast || (isBleve && layers.thermal)) {
      lyrs.push(
        new ColumnLayer({
          id: 'zone-columns-3d',
          data: zoneColumnData,
          diskResolution: 64,
          getRadius: (d: typeof zoneColumnData[0]) => d.radius,
          getPosition: (d: typeof zoneColumnData[0]) => d.position,
          getElevation: (d: typeof zoneColumnData[0]) => d.elevation,
          getFillColor: (d: typeof zoneColumnData[0]) => d.color,
          getLineColor: [255, 255, 255, 75] as [number, number, number, number],
          lineWidthMinPixels: 1.5,
          stroked: true,
          wireframe: true,
          pickable: true,
          extruded: true,
          radiusUnits: 'meters',
          elevationScale: 1,
          material: {
            ambient: 0.45,
            diffuse: 0.75,
            shininess: 32,
            specularColor: [255, 255, 255] as [number, number, number],
          },
          onHover: (info: PickingInfo) => {
            if (info.object) {
              setHoveredInfo({
                zone: info.object.zone,
                label: info.object.label,
                radius: info.object.radius,
              });
            } else {
              setHoveredInfo(null);
            }
          },
        })
      );
    }

    /* Facility radar markers */
    lyrs.push(
      new ScatterplotLayer({
        id: 'facilities-layer',
        data: facilityData,
        getPosition: (d) => d.position,
        getRadius: (d) => d.radius,
        getFillColor: (d) => d.color,
        getLineColor: [200, 230, 255, 255],
        lineWidthMinPixels: 2,
        stroked: true,
        filled: true,
        radiusUnits: 'meters',
        pickable: true,
        onClick: (info: PickingInfo) => {
          if (info.object?.region) {
            onSelectRegion?.(info.object.region);
            setWorldView(false);
          }
        },
      })
    );

    /* Epicenter — Ground Zero hotspot */
    lyrs.push(
      new ScatterplotLayer({
        id: 'epicenter-layer',
        data: epicenterData,
        getPosition: (d) => d.position,
        getRadius: (d) => d.radius,
        getFillColor: [255, 60, 30, 255],
        getLineColor: [255, 220, 60, 255],
        lineWidthMinPixels: 2.5,
        stroked: true,
        filled: true,
        radiusUnits: 'meters',
      })
    );

    /* 3D Dispersion Arc (wind plume trajectory) */
    if (windArcData.length > 0) {
      lyrs.push(
        new ArcLayer({
          id: 'wind-arc-3d',
          data: windArcData,
          getSourcePosition: (d) => d.from.coordinates,
          getTargetPosition: (d) => d.to.coordinates,
          getSourceColor: (d) => d.color,
          getTargetColor: [255, 140, 20, 0],
          getWidth: 3.5,
          widthUnits: 'pixels',
          greatCircle: true,
        })
      );
    }

    return lyrs;
  }, [
    zoneColumnData,
    facilityData,
    epicenterData,
    windArcData,
    fragmentData,
    layers,
    isBleve,
    onSelectRegion,
  ]);

  /* ── Camera Controls ─────────────────────────────────────────────── */
  const tiltUp = useCallback(() => {
    setViewState((v) => ({ ...v, pitch: Math.min(v.pitch + 10, 80) }));
  }, []);

  const tiltDown = useCallback(() => {
    setViewState((v) => ({ ...v, pitch: Math.max(v.pitch - 10, 0) }));
  }, []);

  const rotateCW = useCallback(() => {
    setViewState((v) => ({ ...v, bearing: (v.bearing - 30) % 360 }));
  }, []);

  const rotateCCW = useCallback(() => {
    setViewState((v) => ({ ...v, bearing: (v.bearing + 30) % 360 }));
  }, []);

  const resetCamera = useCallback(() => {
    setViewState((v) => ({
      ...v,
      pitch: 58,
      bearing: -22,
      zoom: selectedRegion.zoom - 1.5,
      longitude: selectedRegion.lng,
      latitude: selectedRegion.lat,
    }));
  }, [selectedRegion]);

  const coords = formatCoordinates(selectedRegion.lat, selectedRegion.lng);

  /* ── Base Map Style (ESRI Satellite or CartoDB Dark) ─────────────── */
  const mapStyle = useMemo(() => {
    if (mapTheme === 'satellite') {
      return {
        version: 8 as const,
        sources: {
          'esri-sat': {
            type: 'raster' as const,
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            ],
            tileSize: 256,
            attribution: 'Tiles © Esri',
            maxzoom: 19,
          },
        },
        layers: [
          {
            id: 'esri-sat-layer',
            type: 'raster' as const,
            source: 'esri-sat',
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      };
    }

    /* High contrast tactical dark basemap (ESRI Dark Gray Canvas - No watermark) */
    return {
      version: 8 as const,
      sources: {
        'esri-dark': {
          type: 'raster' as const,
          tiles: [
            'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
          ],
          tileSize: 256,
          attribution: 'Tiles © Esri — HERE, DeLorme, MapmyIndia',
          maxzoom: 16,
        },
      },
      layers: [
        {
          id: 'esri-dark-layer',
          type: 'raster' as const,
          source: 'esri-dark',
          minzoom: 0,
          maxzoom: 22,
        },
      ],
    };
  }, [mapTheme]);

  return (
    <div className={`map-panel map-panel-earth ${embedded ? 'map-panel-embedded' : ''}`}>
      {/* Header */}
      {!embedded && (
        <div className="map-panel-header">
          <div className="flex items-center gap-3">
            <div className="map-panel-icon">
              <MapIcon className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="map-panel-title flex items-center gap-2">
                <span>Threat matrix · 3D</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-mono font-semibold border border-red-500/30">
                  VOLUMETRIC
                </span>
                <span className="live-indicator" />
              </h2>
              <p className="map-panel-subtitle">
                {selectedRegion.facility} · {selectedRegion.name}, {selectedRegion.state}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Base map theme toggle */}
            <button
              type="button"
              className="map-mode-badge map-mode-badge-btn"
              onClick={() => setMapTheme((t) => (t === 'satellite' ? 'dark' : 'satellite'))}
              title="Toggle between Satellite Imagery and Tactical Dark basemap"
            >
              {mapTheme === 'satellite' ? (
                <>
                  <Sun className="w-3 h-3 text-amber-400" /> Satellite
                </>
              ) : (
                <>
                  <Moon className="w-3 h-3 text-cyan-400" /> Tactical Dark
                </>
              )}
            </button>

            {/* World view toggle */}
            <button
              type="button"
              className={`map-mode-badge map-mode-badge-btn ${worldView ? 'map-mode-badge-active' : ''}`}
              onClick={() => setWorldView((v) => !v)}
              title="Switch between India regional focus and national overview"
            >
              <Globe className="w-3 h-3" /> {worldView ? 'Local Facility' : 'All Facilities'}
            </button>

            <span className="map-mode-badge">
              <Layers className="w-3 h-3 text-blue-400" /> 3D Extrusion
            </span>

            <span className="map-mode-badge map-mode-badge-live">
              <Radio className="w-3 h-3 animate-pulse text-emerald-400" /> LIVE SENSOR
            </span>
          </div>
        </div>
      )}

      {/* 3D Map Canvas */}
      <div
        className={`flex-1 relative overflow-hidden ${embedded ? '' : 'map-3d-scene'}`}
        style={{ minHeight: embedded ? 320 : 500 }}
      >
        <DeckGL
          viewState={viewState}
          onViewStateChange={(e) => setViewState(e.viewState as typeof viewState)}
          controller={{ touchRotate: true, dragRotate: true, doubleClickZoom: true }}
          layers={deckLayers}
          style={{ position: 'absolute', inset: '0' }}
          getTooltip={({ object }: PickingInfo) =>
            object?.region
              ? `${object.region.facility}\n${object.region.name}, ${object.region.state}\nClick to inspect`
              : null
          }
        >
          <Map
            mapStyle={mapStyle as unknown as Parameters<typeof Map>[0]['mapStyle']}
            style={{ position: 'absolute', inset: '0' }}
          />
        </DeckGL>

        {/* Tactical HUD Telemetry (Pitch / Bearing / Altitude) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none z-10">
          <div className="flex items-center gap-2 bg-black/75 backdrop-blur-md border border-white/10 rounded-md px-2.5 py-1 text-[11px] font-mono text-zinc-300 shadow-xl">
            <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
            <span>PITCH <strong className="text-white">{Math.round(viewState.pitch)}°</strong></span>
            <span className="text-zinc-600">|</span>
            <span>BEARING <strong className="text-white">{Math.round(viewState.bearing)}°</strong></span>
            <span className="text-zinc-600">|</span>
            <span>ZOOM <strong className="text-white">{viewState.zoom.toFixed(1)}x</strong></span>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 bg-black/60 backdrop-blur-sm rounded px-2 py-0.5 max-w-fit">
            <Eye className="w-3 h-3 text-zinc-400" />
            <span>Right-click + drag to tilt & orbit in 3D</span>
          </div>
        </div>

        {/* HUD – Ground Zero Epicenter Coordinates Badge */}
        <div className="map-3d-hud-epicenter">
          <Crosshair className="w-3.5 h-3.5 text-red-500 animate-pulse" />
          <span className="font-semibold text-white">{selectedRegion.name}</span>
          <span className="map-3d-hud-coords">
            {coords.lat} · {coords.lng}
          </span>
        </div>

        {/* Camera Tilt & Orbit Controls */}
        <div className="map-3d-camera-controls">
          <button type="button" onClick={tiltUp} title="Tilt camera up (more 3D perspective)" className="cam-btn">
            ▲
          </button>
          <button type="button" onClick={tiltDown} title="Tilt camera down (top-down view)" className="cam-btn">
            ▼
          </button>
          <button type="button" onClick={rotateCCW} title="Orbit left" className="cam-btn">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={rotateCW} title="Orbit right" className="cam-btn">
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={resetCamera} title="Reset 3D camera" className="cam-btn cam-btn-reset">
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3D Zone Hover Tooltip */}
        {hoveredInfo && (
          <div className="map-3d-zone-tooltip">
            <span className="map-3d-zone-tooltip-label">Zone {hoveredInfo.zone} Impact Volume</span>
            <span className="font-medium text-white text-xs">{hoveredInfo.label}</span>
            <span className="map-3d-zone-tooltip-radius font-mono text-amber-300">
              {hoveredInfo.radius.toFixed(0)}m radius
            </span>
          </div>
        )}
      </div>

      {/* Legend & 3D Zone Breakdown */}
      {!embedded && (
        <div className="map-legend">
          {zonesToMap.map((zone) => (
            <div key={zone.zone} className="map-legend-item">
              <span className="map-legend-dot" style={{ backgroundColor: zone.color }} />
              <span className="map-legend-label">Z{zone.zone}</span>
              <span className="map-legend-radius">{zone.radius}m</span>
            </div>
          ))}
          <div className="map-legend-item">
            <span className="map-legend-dot" style={{ backgroundColor: '#ffc040' }} />
            <span className="map-legend-label">Wind ({windDirection}°)</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskMap3D;
