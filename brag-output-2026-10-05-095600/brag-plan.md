# Brag Plan: Threat Zone

## What is this app?
Threat Zone is an autonomous blast physics and consequence modeling platform that visualizes VCE overpressure and BLEVE thermal radiation zones across 10 major Indian refineries and petrochemical complexes — with a kinetic shockwave hero, 3D risk maps, live physics simulation, and real-time hazard decay analytics.

## The angle
This is a military-grade industrial threat intelligence system rendered as a cinematic dark-mode experience. The video plays like a classified briefing: dramatic, measured, and terrifyingly specific. The hook isn't "we built a cool app" — it's "these explosions are real physics, and we mapped every one of them." The shockwave canvas hero with its SVG cutout mask is the visual signature; the KPI stats (TNT equivalence, fireball diameter, evacuation zones) are the payoff.

## Hook (first 2-3 seconds)
Black screen. A shockwave ring expands from center — amber and red, just like the hero canvas. The words "THREAT ZONE" slam in through the ring, white on black, using the Syne 800-weight typeface. The ring passes through the letters. No other text. No explanation. Just the name and the shockwave.

## Key moments (the middle)
- **The live 3D risk map** — blast contour rings overlaid on an Indian refinery location (Jamnagar). Zone labels (Z1: 8.0 PSI, Z2: 3.5 PSI) appear one by one, expanding outward from the epicenter. The map is dark, the zones are concentric amber-to-red gradients.
- **KPI stat cards pop in** — four metrics arrive in sequence: "Peak Overpressure: 8.2 PSI", "TNT Equivalence: 2,400 kg", "Fireball Diameter: 210 m", "Evacuation Zone: 1,250 m". Each with a sharp impact sound. Monospace numbers, clean labels.
- **Physics parameter sliders** — a brief flash of the simulator controls: vessel volume, fill percentage, operating pressure. The numbers animate/increment to show this is a live system, not a static report.

## Outro / punchline
"AUTONOMOUS CONSEQUENCE PHYSICS." in Syne 800. Beat. Then smaller: "10 Refineries. Live Radar. Real Blast Models." Fade to the Threat Zone wordmark with the live-dot badge. Cut to black.

## User flow worth showing
Select a refinery (Jamnagar) on the 3D map → Configure explosion scenario (VCE, 50m³ LPG, 8 bar) → View expanding blast contour zones with KPI results (TNT mass, energy, overpressure radii, evacuation distance).

## Tone
- Preset: cinematic
- Creative direction: classified military threat briefing — dark, measured, terrifyingly specific
- Interpretation: Slow dramatic reveals, heavy display type, dark backgrounds. Every element feels weighty. Transitions are dramatic wipes or slow crossfades. Typography uses ALL CAPS Syne. No humor — this is deadly serious.

## Format: landscape — 1920x1080
## Duration: 20 seconds

## Visual identity (from the project)
- Background: #000000 (pure black)
- Accent: #f59e0b (amber) and #ef4444 (red) — the blast/thermal color pair
- Text: #ffffff (white)
- Display font: Syne (800 weight, 0.03em letter-spacing)
- Body font: Plus Jakarta Sans / Inter
- Mono font: JetBrains Mono (for metrics and data)
- Strongest visual element: The SVG cutout mask hero with kinetic shockwave canvas (rings expand, fiery sparks scatter, radar sweep rotates)

## Share copy (draft)
THREAT ZONE models blast overpressure and BLEVE fireballs across 10 Indian refineries. Autonomous consequence physics — live.

## Audio direction
- Role: cinematic support — dark, dramatic, building tension
- Music: `happy-beats-business-moves-vol-12-by-ende-dot-app.mp3` — steady and clean, used at low volume as a dark cinematic bed
- Music treatment: Fade in from 0s at 0.25 volume; subtle swell at the KPI reveal (≈8.7s); fade out under final logo (≈18s onward)
- Music cue guidance: Bundled preset at `cues/happy-beats-business-moves-vol-12-by-ende-dot-app.music-cues.json`. Tempo: 110 BPM. Strong cues to target: 8.74s (KPI reveal), 13.11s (parameter flash), 17.47s (outro slam). Beat grid for sequential stat cards: 9.29s, 9.83s, 10.37s, 10.93s.
- Audio-reactive treatment: subtle; use music RMS/bass to make the shockwave ring glow and KPI card presence breathe. No waveform/equalizer visuals.
- SFX posture: sparse cinematic — 2-3 deep impact bells for major reveals, one soft card sequence for stats
- Audio-coupled moments:
  - Scene 1 (hook) — deep impact bell as "THREAT ZONE" slams in
  - Scene 2 (map) — card-slide SFX as zone labels appear one by one
  - Scene 3 (KPIs) — impactBell_heavy for each stat card (beat-grid aligned)
  - Scene 4 (outro) — final deep bell as wordmark lands
- Restraint rule: No stacking SFX. No aggressive punches. Everything should feel like a measured military briefing, not a hype reel.

## Storyboard

### Scene 1 — "Shockwave Hook" — 3s
Black background. A concentric shockwave ring expands from center in amber (#f59e0b), followed by a red (#ef4444) ring — matching the hero canvas animation. "THREAT ZONE" slams in at the center in Syne 800-weight, ALL CAPS, white, large-scale (the SVG cutout mask signature). Subtle architectural border stroke appears around the letters (rgba(255, 255, 255, 0.32)). The ring passes through the text.
Sequential/interaction: yes — first ring expands, then second ring, then text slams in
Audio intent: dramatic entrance, tension-setting
Audio-coupled idea: deep impact bell (impactBell_heavy_000) as text lands at ~1.5s
Music: cinematic bed fades in
Transition mood: dramatic → Scene 2

### Scene 2 — "Blast Contour Map" — 5s
Dark 3D map view centered on Jamnagar, Gujarat. Concentric blast zone rings expand outward from the facility. Zone labels appear one by one: "Z1: 8.0 PSI — 185m" (red), "Z2: 3.5 PSI — 340m" (amber), "Z3: 1.0 PSI — 780m" (yellow). A small facility badge reads "Reliance Industries · Jamnagar, Gujarat" in JetBrains Mono. A radar sweep line rotates subtly in the background.
Sequential/interaction: yes — zone rings expand one by one, each with its label
Audio intent: building tension, each zone landing feels ominous
Audio-coupled idea: card-slide SFX for each zone label appearance, ~1.2s apart
Transition mood: dramatic → Scene 3

### Scene 3 — "Consequence Metrics" — 5s
Four KPI stat cards appear in a clean grid on black. Each card: monospace number in large JetBrains Mono, label in Plus Jakarta Sans below. The four metrics: "Peak Overpressure: 8.2 PSI", "TNT Equivalence: 2,400 kg", "Fireball Diameter: 210 m", "Evacuation Zone: 1,250 m". Numbers count up rapidly from 0 to their final value. Cards arrive one by one with a subtle amber glow border.
Sequential/interaction: yes — 4 stat cards pop in one by one on the beat grid (~0.55s apart), numbers animate up
Audio intent: rhythmic impact, each stat landing like a verdict
Audio-coupled idea: impactBell_heavy (different variants) for each card landing, beat-grid aligned at 9.29s, 9.83s, 10.37s, 10.93s
Transition mood: clean → Scene 4

### Scene 4 — "Physics Engine Flash" — 3s
Brief recreation of the simulator panel: dark glassmorphic cards with parameter labels and values. Vessel Volume: "50 m³", Operating Pressure: "8.0 bar", Temperature: "25°C". The numbers shimmer/increment slightly to show live-ness. A "LIVE PHYSICS" badge pulses with a green dot (matching the navbar's live-dot). Small text: "VCE Multi-Energy Model · TNO Compliant".
Sequential/interaction: yes — parameters appear in staggered sequence
Audio intent: quiet precision, mechanical
Audio-coupled idea: soft interface clicks as parameters appear
Transition mood: dramatic → Scene 5

### Scene 5 — "Outro / Punchline" — 4s
"AUTONOMOUS CONSEQUENCE PHYSICS." in Syne 800, ALL CAPS, centered, white on black. Holds for 1.5s. Then smaller text fades in below: "10 Refineries · Live Radar · Real Blast Models". Holds for 1.2s. Final beat: "THREAT ZONE" wordmark appears at the bottom with the red/amber live-dot badge. Cut to black.
Sequential/interaction: yes — headline → supporting text → wordmark in sequence
Audio intent: finality, authority
Audio-coupled idea: impactBell_heavy_004 on headline landing (~17.5s, beat-locked to 17.47s strong cue); soft fade
Transition mood: final — cut to black

**Music mood for this video:** cinematic
**Audio summary:** Low cinematic bed building through the first three scenes, peaking subtly at the KPI reveal, then fading under the outro as the final impact bell rings over the wordmark.
