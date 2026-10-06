# Hyperframes Composition Brief: Threat Zone

## Objective
Create a short, cinematic, high-impact launch-style brag video for Threat Zone showcasing real-time industrial process safety consequence modeling for Indian petrochemical facilities.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/threat-zone-demo.mp4`
- Format: landscape — 1920x1080
- Duration: 19.5s, 30fps

## Source Material
- Project root: `d:\PROJECTS\Threat-Zone`
- Primary files read: `index.html`, `DESIGN_SYSTEM.md`, `src/App.tsx`, `src/components/ThreatZoneHeroBanner.tsx`, `src/components/dashboard/DashboardShell.tsx`, `src/design/industrial-tokens.css`
- Product name: Threat Zone
- Tagline: "Model blast and fire risk at Indian refineries — live maps, physics-based zones, and clear safety guidance."
- Key UI or visual moment to recreate:
  - Signature typography cutout mask: "THREAT ZONE" with dynamic shockwave blast rings & fire ember particles.
  - 3-panel industrial control dashboard with satellite epicenter radar and concentric hazard rings.
  - Real-time parameter recalculation: VCE/BLEVE toggle, sliders, animated KPI banner.
  - Distance-decay overpressure graph and emergency evacuation advisories.
- Copy that must appear verbatim:
  - "THREAT ZONE"
  - "Jamnagar Refinery (RIL) · 22.4707°N, 69.8384°E"
  - "Zone 1 Severe · Zone 2 Medium · Zone 3 Low · Zone 4 Safe Boundary"
  - "Peak Overpressure (Pso): 8.4 psi"
  - "TNT Equivalent: 2.4 t"
  - "Safe Evacuation Distance: 1,420 m"
  - "EVACUATE BEYOND ZONE 4"

## Creative Direction
- Tone preset: `cinematic` / `polished`
- Creative direction: Control-room industrial telemetry meets sleek, authoritative safety engineering.
- Interpretation: Deep dark backgrounds, high-contrast hazard amber accents, crisp JetBrains Mono numeric telemetry, smooth deterministic GSAP animations.
- Angle: Modernizing industrial risk modeling from slow legacy tools to an instant, visual, browser-native safety command center.
- Hook: The dramatic cutout title mask glowing with shockwaves and sparks from the explosion epicenter.
- Outro / punchline: "Model blast & fire risk at Indian refineries. Live. Accurate. Emergency-ready."

## Visual Identity
- Background: `#0F172A` / `#040404`
- Surface Panels: `#1E293B`, `#243044`
- Accent: `#F59E0B`
- Hazard Zones: `#EF4444` (Severe), `#F59E0B` (Medium), `#10B981` (Low), `#0284C7` (Safe)
- Text: Primary `#F8FAFC`, Secondary `#94A3B8`
- Display font: Syne / Plus Jakarta Sans
- Monospace font: JetBrains Mono

## Storyboard
1. Scene 1 — Kinetic Shockwave Hook — 0.0s to 3.8s (3.8s) — Epicenter shockwaves, fiery particles, cutout typography.
2. Scene 2 — Live Satellite Blast Radius — 3.8s to 8.7s (4.9s) — Jamnagar RIL map reveal, 4 concentric hazard zones, wind compass.
3. Scene 3 — Real-Time Physics Recalculation — 8.7s to 13.1s (4.4s) — VCE to BLEVE toggle, sliders glide, KPI counters tick up.
4. Scene 4 — Consequence Analytics & Safety Advisory — 13.1s to 17.5s (4.4s) — Distance-decay Pso curve draws, emergency evacuation alert box.
5. Scene 5 — Outro & Authority Brandmark — 17.5s to 19.5s (2.0s) — Clean final lockup with badge `● PHYSICS ENGINE LIVE`.

## Audio
- Audio role: Driving electronic synth pulse with tactile mechanical UI clicks and sub-bass blast hums.
- Music: `assets/music/happy-beats-business-moves-vol-12-by-ende-dot-app.mp3`
- SFX files in `assets/sfx/`:
  - `impactPlate_medium_000.ogg` (initial shockwave & final logo impact)
  - `click_002.ogg` (facility select & layer toggles)
  - `switch30.ogg` (VCE/BLEVE mode change)
  - `switch_001.ogg` (slider parameter shifts)
  - `bong_001.ogg` (safety advisory trigger)
- Audio treatment: Music runs from 0.0s to 19.5s with subtle volume ducking under SFX, fading smoothly out at 19.5s.
