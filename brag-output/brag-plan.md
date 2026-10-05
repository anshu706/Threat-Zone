# Brag Plan: Threat Zone

## What is this app?
Threat Zone is an industrial process safety visualizer that models real-time VCE (Vapor Cloud Explosion) and BLEVE consequences for Indian oil & gas refineries and petrochemical plants on live satellite maps with physics-based blast and thermal zones.

## The angle
Industrial consequence modeling is usually trapped in clunky, legacy desktop software with spreadsheets and slow static reports. Threat Zone brings military-grade industrial risk simulation directly into a slick, high-contrast, control-room interface — calculating overpressure decay curves, TNT equivalency, fireball radiuses, and evacuation perimeters over actual satellite imagery in real-time.

## Hook (first 2-3 seconds)
The signature architectural cutout typography mask: "THREAT ZONE" carved into a pitch-black canvas, with pulsating shockwaves and fiery embers expanding outward at 60 FPS from the epicenter. Telemetry HUD reads: `FACILITY HAZARD ENGINE // LIVE`.

## Key moments (the middle)
- **Facility Epicenter & Live Sat Map**: Rapid zoom into Jamnagar Refinery (RIL) with live wind vector radar, coordinates (22.4707°N, 69.8384°E), and dynamic concentric hazard rings (Zone 1 Severe to Zone 4 Safe).
- **Physics Parameter Manipulation**: Switching between VCE (Vapor Cloud Explosion) and BLEVE (Boiling Liquid Expanding Vapor Explosion); dragging tank pressure to 12.0 bar and volume to 1,500 m³ as the KPI strip counters roll up in real-time.
- **Consequence Analytics & Safety Guidance**: Real-time distance-decay curve rendering Peak Overpressure (Pso) vs distance, accompanied by emergency safety advisories ("Zone 1: Fatalities likely, complete destruction / Evacuate all personnel beyond 1,420m").

## Outro / punchline
"When every second counts in industrial safety, don't guess the blast zone. Model it."
Closing title card with the Threat Zone emblem, live status indicator (`● PHYSICS ENGINE LIVE · INDIAN REFINERIES`), and clean command-line / web CTA.

## User flow worth showing
1. **Entry**: Select high-risk refinery site (Jamnagar RIL / Gujarat).
2. **Key Action**: Toggle VCE/BLEVE physics model & adjust tank pressure / fill parameters; observe expanding shockwave zones.
3. **Result**: Live overpressure radius calculation (TNT Eq 2.4t, Pso 8.4 psi) with evacuation perimeter and distance-decay risk curve.

## Tone
- Preset: `cinematic` / `polished`
- Creative direction: Control-room industrial telemetry meets sleek, authoritative safety engineering.
- Interpretation: Crisp, high-contrast dark surfaces (`#0F172A`), electric hazard amber (`#F59E0B`), critical alert crimson (`#EF4444`), precision monospace data, and decisive motion.

## Format: landscape — 1920x1080, 30fps
## Duration: 19.5s

## Visual identity (from the project)
- Background: `#0F172A` (deep slate navy) / `#040404` (epicenter black)
- Surface Panels: `#1E293B` (chrome dark slate), `#243044` (elevated KPI cards)
- Accent: `#F59E0B` (industrial hazard amber)
- Critical Zone 1: `#EF4444` (crimson red)
- Medium Zone 2: `#F59E0B` (amber)
- Low Zone 3: `#10B981` (emerald green)
- Safe Zone 4: `#0284C7` (cyan blue)
- Text Primary: `#F8FAFC`
- Text Muted: `#94A3B8`
- Display Font: Syne / Plus Jakarta Sans
- Monospace Data Font: JetBrains Mono

## Share copy (draft)
Introducing Threat Zone: real-time VCE & BLEVE consequence modeling for Indian refineries with physics-driven blast zones on satellite maps.

## Audio direction
- Role: Driving electronic pulse with subtle industrial accents and telemetry sounds.
- Music: `happy-beats-business-moves-vol-12-by-ende-dot-app.mp3` (109.96 BPM, crisp synthetic beat).
- Music treatment: Starts immediately at t=0, driving rhythm builds at 3.8s, full swell through dashboard demonstration, tight fade-out into final brand logo lock.
- Music cue guidance: Strong cues at 3.82s, 8.74s, 13.11s, 17.47s. Beat-grid spacing ~0.55s.
- Audio-coupled moments:
  - t=0.0s: Deep sub rumble with shockwave expansion.
  - t=3.82s: Snappy UI switch sound on facility lock.
  - t=8.74s: Mechanical toggle and slider click as parameters adjust.
  - t=13.11s: Analytic chime as distance-decay curve calculates.
  - t=17.47s: Final logo impact and telemetry ping.

## Storyboard

### Scene 1 — Kinetic Shockwave Hook — 3.8s
- Visuals: Dark screen with huge bold "THREAT ZONE" typography cutout mask. Concentric shockwave rings expand at supersonic speeds with fiery ember particles radiating from the center. Telemetry badge: `PROCESS SAFETY // VCE & BLEVE SIMULATOR`.
- Sequential/interaction: Lettering illuminates, shockwave rings pulse on beats 1.09s, 2.19s, 3.27s.
- Audio intent: Low bass swell, digital charge, building anticipation.
- Transition mood: Dramatic expansion wipe → Scene 2.

### Scene 2 — Live Satellite Blast Radius — 4.9s (3.8s to 8.7s)
- Visuals: The 3-panel command dashboard snaps onto screen. Centered map over Jamnagar Refinery (RIL) with satellite imagery, crosshairs, and 4 animated hazard zones expanding outward (Zone 1 Red 10 psi, Zone 2 Amber 5 psi, Zone 3 Emerald 1 psi, Zone 4 Cyan 0.3 psi).
- Sequential/interaction: Site dropdown clicks to "Jamnagar RIL (Gujarat)", wind direction compass aligns to 240° WSW at 15 km/h.
- Audio intent: Sharp UI click, telemetry hum, radio-like data chirp.
- Transition mood: Fast slide focus → Scene 3.

### Scene 3 — Real-Time Physics Recalculation — 4.4s (8.7s to 13.1s)
- Visuals: Left control panel focus. Toggle switches from VCE to BLEVE. Pressure slider moves from 6.0 to 12.0 bar, tank volume increases to 1,500 m³. KPI cards roll up with animated numbers: TNT Eq `2.4 t`, Peak Pso `8.4 psi`, Safe Distance `1,420 m`, Energy `112,000 MJ`.
- Sequential/interaction: Toggle switches, sliders glide right, KPI values tick up rapidly.
- Audio intent: Tactile mechanical switches, fast ticking counters, rising energy.
- Transition mood: Smooth pan to analytics → Scene 4.

### Scene 4 — Consequence Analytics & Safety Advisory — 4.4s (13.1s to 17.5s)
- Visuals: Right analytics panel. High-precision overpressure distance-decay curve draws smoothly across Cartesian coordinates. Critical advisory alert box pulses: `⚠️ EVACUATE BEYOND ZONE 4 (>1,420m) · STRUCTURAL COLLAPSE THRESHOLD AT 380m`.
- Sequential/interaction: Decay curve traces from 10 psi down to 0.3 psi, advisory banner blinks into red alert state.
- Audio intent: Tech verification sweep, alert tone, crisp data lock.
- Transition mood: Cinematic focus pull → Scene 5.

### Scene 5 — Outro & Authority Brandmark — 2.0s (17.5s to 19.5s)
- Visuals: Centered command badge: "THREAT ZONE" with shield icon and subtitle: "Model blast & fire risk at Indian refineries". Live engine badge: `● PHYSICS ENGINE LIVE`. Clean URL / repository call-to-action.
- Audio intent: Final resonant impact, gentle music reverb tail into silence.
