# Hyperframes Composition Brief: Threat Zone

## Objective
Create a short cinematic launch-style brag video for Threat Zone — an autonomous blast physics and consequence modeling platform for Indian industrial safety.

## Output
- Composition directory: `brag-output-2026-10-05-095600/composition/`
- Rendered video: `brag-output-2026-10-05-095600/brag.mp4`
- Format: landscape — 1920x1080
- Duration: 20 seconds

## Source Material
- Project root: `d:\PROJECTS\Threat-Zone`
- Primary files read: `index.html`, `src/App.tsx`, `src/components/ThreatZoneHeroBanner.tsx`, `src/components/PinnedProjectShowcase.tsx`, `src/components/ResultsPanel.tsx`, `src/dreamhouse.css`, `src/index.css`
- Product name: Threat Zone
- Tagline / strongest claim: "Autonomous blast physics, consequence modeling, and live consequence radar for Indian refineries and hazardous petrochemical complexes."
- Key UI or visual moment to recreate: The SVG cutout mask hero with kinetic shockwave rings, the 3D blast contour map with zone labels, and the KPI stat cards
- Copy that must appear verbatim:
  - "THREAT ZONE"
  - "Peak Overpressure: 8.2 PSI"
  - "TNT Equivalence: 2,400 kg"
  - "Fireball Diameter: 210 m"
  - "Evacuation Zone: 1,250 m"
  - "AUTONOMOUS CONSEQUENCE PHYSICS."
  - "10 Refineries · Live Radar · Real Blast Models"

## Creative Direction
- Tone preset: cinematic
- Creative direction: classified military threat briefing — dark, measured, terrifyingly specific
- Interpretation: Slow dramatic reveals, heavy display type on pure black backgrounds. Every element lands with authority. Transitions are dramatic wipes or slow crossfades. The shockwave rings expanding are the visual signature. Typography uses ALL CAPS Syne 800-weight for headlines and JetBrains Mono for data/metrics. No humor — this is deadly serious industrial intelligence.
- Angle: Military-grade industrial threat intelligence rendered as a cinematic dark-mode experience. The video plays like a classified briefing: dramatic, measured, and terrifyingly specific. The hook isn't "we built a cool app" — it's that these explosions are real physics, mapped across real facilities.
- Hook: Shockwave ring expands from center, "THREAT ZONE" slams through it in Syne 800
- Outro / punchline: "AUTONOMOUS CONSEQUENCE PHYSICS." → "10 Refineries · Live Radar · Real Blast Models" → wordmark with live-dot badge
- Avoid:
  - Generic SaaS language ("streamline your workflow", "excited to share")
  - Abstract filler visuals or decorative patterns
  - Colorful/playful aesthetics — this is dark and serious
  - Humor or lightheartedness

## Visual Identity
- Background: #000000 (pure black)
- Text: #ffffff (white)
- Accent primary: #f59e0b (amber — blast/warning)
- Accent secondary: #ef4444 (red — danger/thermal)
- Accent tertiary: #34c759 (green — for "LIVE" dot indicator only)
- Border: rgba(255, 255, 255, 0.12) for subtle card borders
- Display font: Syne, 800 weight, 0.03em letter-spacing (Google Fonts: `https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap`)
- Body font: Plus Jakarta Sans (Google Fonts: `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap`)
- Mono font: JetBrains Mono (Google Fonts: `https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&display=swap`)
- Visual references from the project:
  - Shockwave rings: concentric arcs expanding from center, amber/red, fading as they grow (see ThreatZoneHeroBanner canvas animation)
  - SVG cutout mask: text cuts a hole through black overlay, revealing kinetic background
  - Radar sweep line: thin white line rotating from center
  - Blast zone contours: concentric colored rings labeled Z1/Z2/Z3/Z4 with PSI values
  - KPI stat cards: monospace numbers, label below, subtle amber glow border
  - Live-dot badge: small green pulsing dot + "LIVE PHYSICS" label
  - Glassmorphic card panels: rgba(28, 28, 30, 0.75) with blur backdrop

## Storyboard
Use the storyboard in `brag-output-2026-10-05-095600/brag-plan.md` as the creative contract.

Scene summary:
1. "Shockwave Hook" — 3s — Expanding shockwave rings, "THREAT ZONE" slams in center
2. "Blast Contour Map" — 5s — Dark map, blast zones expand with labels (Z1-Z3), facility badge
3. "Consequence Metrics" — 5s — Four KPI stat cards pop in with counting numbers
4. "Physics Engine Flash" — 3s — Simulator parameters with live values, "LIVE PHYSICS" badge
5. "Outro / Punchline" — 4s — "AUTONOMOUS CONSEQUENCE PHYSICS." → supporting text → wordmark

## Audio
- Audio role: cinematic support — dark dramatic bed building tension
- Audio arc: Low bed fading in at the shockwave hook, subtle swell through blast zones and KPI reveals, fading under final wordmark as impact bell rings
- Music: `happy-beats-business-moves-vol-12-by-ende-dot-app.mp3`
- Music treatment: Fade in from 0s at volume 0.25; subtle presence throughout; fade out starting ~18s, fully silent by 20s. Low-energy posture — the music supports but never dominates.
- Music cue guidance: Bundled preset at `C:\Users\DELL\.gemini\config\skills\brag\assets\music\cues\happy-beats-business-moves-vol-12-by-ende-dot-app.music-cues.json`. Tempo: 110 BPM. Target strong cues: 8.74s (KPI reveal Scene 3), 13.11s (physics flash Scene 4), 17.47s (outro headline slam Scene 5). Beat grid for sequential stat cards in Scene 3: 9.29s, 9.83s, 10.37s, 10.93s.
- Audio-reactive treatment: subtle; use music RMS/bass to make shockwave ring glow and KPI card presence breathe. No waveform/equalizer visuals.
- Audio-coupled moments:
  - Scene 1 / hook (1.5s) — impactBell_heavy_000 as "THREAT ZONE" text slams in
  - Scene 2 / zone reveals (4-6s) — card-slide SFX for each zone label appearance
  - Scene 3 / KPI cards (8.7-11s) — impactBell_heavy variants for each stat card (beat-grid aligned)
  - Scene 5 / outro (17.5s) — impactBell_heavy_004 on "AUTONOMOUS CONSEQUENCE PHYSICS." landing
- SFX selection guidance: Use deep resonant impact bells for major reveals (impactBell_heavy family). Use card-slide sounds for sequential zone labels. Everything should feel measured and authoritative — no harsh, aggressive, or chaotic sounds.
- SFX analysis guidance: `C:\Users\DELL\.gemini\config\skills\brag\assets\sfx\sfx-analysis.md` — prefer low HF-risk files for the polished cinematic tone
- Exact SFX choice: Hyperframes should choose filenames, timestamps, density, and volume based on the implemented animation.
- Audio files: copy the chosen music and any Hyperframes-selected SFX into `brag-output-2026-10-05-095600/composition/assets/`

## Hyperframes Instructions
Load the composition-building Hyperframes domain skills — `hyperframes-core`, `hyperframes-animation`, `hyperframes-creative`, `hyperframes-keyframes`, `hyperframes-cli`. /brag is its own workflow: do not enter the `hyperframes` entry-point intent interview and do not route into its generic promo / launch-video workflow. Prefer native Hyperframes conventions over anything in `/brag`.

Requirements:
- Show at least one real UI, copy, or visual element from the source project.
- Keep all text readable in the final render.
- Keep the video within 15-25 seconds.
- Include the planned music/SFX layer unless audio was explicitly disabled or documented as intentionally silent.
- Treat `/brag` audio notes as guidance, not a fixed cue sheet. Choose SFX after the visual animation exists.
- Treat music cue metadata as optional timing hints. Hyperframes decides exact animation timing and should ignore cues that hurt readability, scene pacing, or the product story.
- Major reveals may move toward nearby strong cues within about 0.15s. Smaller entrances may align to nearby beat points within about 0.10s. Use only 1-3 strong cue locks in a 15-25s video unless the edit clearly benefits from more.
- Use SFX to support motion and interaction: card sounds for card-like reveals, short announcement cues for major payoffs, key/click sounds for text or user actions, and restraint when the edit is already busy.
- Honor planned music treatment such as fade-outs, ducking, beat-aligned reveals, or letting a final SFX ring over the music, using the best Hyperframes-supported implementation.
- When music is present and the treatment is not `none`, consider Hyperframes audio-reactive workflow: extract audio data and use RMS/frequency bands for subtle, brand-specific motion. Good targets are glow, depth, background warmth, card presence, title emphasis, or other existing visual elements. Avoid waveform/equalizer visuals, musical-note graphics, generic particle systems, strobing, or heavy pulsing.
- Use local assets for audio and any required runtime/media dependencies when possible.
- Run `hyperframes check` before render — it is brag's single gate.
