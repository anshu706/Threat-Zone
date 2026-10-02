# Hyperframes Composition Brief: Threat Zone

## Objective
Create a short, dramatic, highly polished launch-style brag video for Threat Zone — India's premier industrial consequence and blast radius visualizer for oil & gas refineries.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape — 1920x1080
- Duration: 19.5 seconds

## Source Material
- Project root: `d:\PROJECTS\Threat-Zone`
- Primary files read: `index.html`, `DESIGN_SYSTEM.md`, `src/constants/data.ts`, `src/constants/regions.ts`, `src/components/dashboard/`, `public/showcase/jamnagar.jpg`
- Product name: Threat Zone
- Tagline / strongest claim: "Model blast and fire risk at Indian refineries — live maps, physics-based zones, and clear safety guidance." / "Model a 50-tonne BLEVE fireball before it happens."
- Key UI or visual moment to recreate:
  - Real Jamnagar refinery aerial/satellite canvas with 4 concentric blast zones (Zone 1 Severe `#EF4444` to Zone 4 Safe `#0284C7`) and wind vector compass
  - Control room dashboard with VCE / BLEVE segmented toggle, live parameter sliders (18.5 bar, 85% fill)
  - Real-time KPI banner: TNT Equiv 4.8t, Peak Pso 14.2 psi, Fireball 310m
  - Live industrial emergency advisory card
- Copy that must appear verbatim:
  - "WHEN 50 TONNES OF HYDROCARBON FLASH..."
  - "RELIANCE JAMNAGAR REFINERY · 1.4 MMbpd"
  - "● PHYSICS ENGINE LIVE"
  - "ZONE 1: FATAL OVERPRESSURE · STRUCTURAL DEMOLITION"
  - "MANDATORY EVACUATION BOUNDARY: 2,450 METERS"
  - "MODEL THE WORST CASE. BEFORE IT HAPPENS."
  - "THREAT ZONE"

## Creative Direction
- Tone preset: `cinematic`
- Creative direction: "High-stakes industrial disaster simulation & refinery command room film"
- Interpretation: Serious, cold, authoritative, dark control-room aesthetic, crisp high-contrast telemetry, dramatic shockwave expansion synced to audio beats.
- Angle: Contrast catastrophic industrial hazards with the surgical precision of real-time physics consequence modeling at India's highest-capacity petroleum infrastructure.
- Hook: Satellite crosshair locking onto Jamnagar storage tanks with ominous warning statement (0.0-3.2s).
- Outro / punchline: "MODEL THE WORST CASE. BEFORE IT HAPPENS." (16.5-19.5s).
- Avoid:
  - Generic SaaS language ("Streamline your safety workflows")
  - Abstract filler graphics, rainbow charts, or cartoon explosions
  - Cheesy marketing tropes

## Visual Identity
- Background: `#0F172A` (deep industrial slate)
- Panel Background: `#1E293B`
- Panel Border: `#334155`
- Primary Text: `#F8FAFC`
- Muted Text: `#94A3B8`
- Brand Accent: `#F59E0B` (amber alert)
- Severe Zone 1: `#EF4444`
- Medium Zone 2: `#F59E0B`
- Low Zone 3: `#10B981`
- Safe Zone 4: `#0284C7`
- Display Font: `Syne`, `Inter`, sans-serif
- Body Font: `JetBrains Mono`, `Inter`, monospace
- Visual references from the project: `public/showcase/jamnagar.jpg`, `DESIGN_SYSTEM.md` token set, industrial HUD telemetry.

## Storyboard
Use `brag-output/brag-plan.md` as the creative contract.

Scene summary:
1. Scene 1 — The Hook: Uncontained Threat (0.0s – 3.2s, 3.2s) — Satellite targeting Jamnagar, coordinate lock, ominous headline.
2. Scene 2 — Physics Simulation & BLEVE Activation (3.2s – 8.0s, 4.8s) — VCE/BLEVE toggle snaps, parameter sliders dial in, KPI cards slam into place.
3. Scene 3 — The Detonation & Blast Perimeter (8.0s – 13.5s, 5.5s) — Jamnagar satellite view, shockwave detonation at 8.74s, 4 concentric blast zones expand with real-time vector flags.
4. Scene 4 — Emergency Advisory & Consequence Telemetry (13.5s – 16.5s, 3.0s) — Critical evacuation boundary alert card, overpressure decay metrics.
5. Scene 5 — Outro & Brand Lockup (16.5s – 19.5s, 3.0s) — "MODEL THE WORST CASE. BEFORE IT HAPPENS." + Threat Zone industrial logo.

## Audio
- Audio role: Cinematic electronic bed with deep tension, industrial precision clicks, and dramatic shockwave impact.
- Music: `happy-beats-business-moves-vol-12-by-ende-dot-app.mp3`
- Music treatment: Low swell intro, strong beat drop at 8.74s precisely locked to the blast wave expansion, driving tempo through scene 4, clean fade-out under the final brand lockup.
- Music cue guidance: Use `happy-beats-business-moves-vol-12-by-ende-dot-app.music-cues.md`.
  - Strong beat at 8.74s (strong_beat 0.99) — Detonation moment
  - Strong beat at 13.11s (strong_beat 0.98) — Advisory popup
  - Strong beat at 17.47s (strong_beat 0.99) — Outro brand lockup
- SFX files:
  - Toggle click: `assets/sfx/impact/impactTin_medium_000.ogg`
  - Blast detonation impact: `assets/sfx/impact/impactPlate_heavy_000.ogg`
  - Advisory / HUD chime: `assets/sfx/impact/impactBell_heavy_004.ogg`
- Audio files: Copied into `brag-output/composition/assets/`

## Hyperframes Instructions
Use Hyperframes standard structure and conventions:
- Pure HTML, CSS, JavaScript / GSAP animation inside `<output-dir>/composition/`
- Register metadata with `data-duration="19.5"`
- Ensure `npx hyperframes check` passes cleanly with zero errors before rendering
- Ensure all text has sufficient contrast against dark background
- Render crisp 1920x1080 30fps MP4
