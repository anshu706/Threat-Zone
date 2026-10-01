# Threat Zone — Industrial UI/UX Design System

**Principal Product Design Spec** · Process Safety · VCE & BLEVE · India Facilities

---

## 1. Product identity

| Field | Value |
|--------|--------|
| **Name** | Threat Zone |
| **Tagline** | Model blast and fire risk at Indian refineries — live maps, physics-based zones, and clear safety guidance. |
| **Audience** | Process Safety Engineers, HSE Managers, Operations, Emergency Responders, Safety Trainees |
| **Philosophy** | High-density industrial data, high legibility. Instant feedback on parameter change. Authoritative, emergency-ready, uncluttered. |

---

## 2. Component hierarchy

```
ThreatZoneApp
├── OnboardingWizard (first-run)
└── DashboardShell
    ├── TopBar
    │   ├── BrandMark + Title
    │   ├── LiveEngineBadge
    │   └── ExportBar (Copy · Share URL · Print/PDF)
    ├── MobilePanelTabs (tablet/phone)
    └── ThreePanelGrid
        ├── ControlPanel (left, 320px)
        │   ├── SiteSelect
        │   ├── ModelToggle [ VCE | BLEVE ]
        │   ├── ScenarioSelect
        │   ├── FuelSelect
        │   ├── ParameterSliders (P, T, V, fill, ambient, RH, wind)
        │   └── KpiBanner (TNT · Pso · Safe distance · Energy)
        ├── MapCanvas (center, fluid)
        │   ├── LayerChips (Blast · Thermal · Fragment)
        │   ├── WindCompass
        │   └── RiskMap (Leaflet satellite + zone rings)
        └── AnalyticsPanel (right, 380px)
            ├── TabBar [ Decay | Compare | Safety ]
            ├── RiskCharts (distance-decay)
            ├── ComparisonCharts (environment)
            └── Advisories + AlertCards
```

---

## 3. Wireframe — desktop (1440px)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ TZ  Threat Zone          ● Physics live          [Copy][Link][Print][☀]     │
├──────────────┬───────────────────────────────────────────────┬─────────────┤
│ SCENARIO &   │  [Blast][Thermal][Fragment]          [Wind ↗]  │ ANALYTICS   │
│ PHYSICS      │ ┌─────────────────────────────────────────┐   │ [Decay|Cmp|Safe]
│              │ │  ○ Z4 ─────────────────────────────     │   │             │
│ [Jamnagar ▼] │ │    ○ Z3 ───────────────────           │   │ ▓▓ Chart    │
│ [VCE|BLEVE]  │ │       ○ Z2 ─────────────              │   │ distance    │
│ [Scenario ▼] │ │          ○ Z1 ────  ● epicenter         │   │ decay       │
│ [Fuel ▼]     │ │         satellite map canvas            │   │             │
│ ── sliders ─ │ └─────────────────────────────────────────┘   │ ⚠ Evacuate  │
│ P  ████ 12bar│                                               │ beyond Z4   │
│ T  ████ 45°C │                                               │             │
│ ┌────┬────┐  │                                               │ Equipment   │
│ │TNT │Pso │  │                                               │ fixes…      │
│ │2.1t│8psi│  │                                               └─────────────┘
│ └────┴────┘  │
└──────────────┴───────────────────────────────────────────────┴─────────────┘
```

---

## 4. Wireframe — tablet / field (768px)

```
┌─────────────────────────────┐
│ TopBar                      │
├─────────────────────────────┤
│ [ Control | Map | Analytics ]  ← tab switch
├─────────────────────────────┤
│                             │
│     MAP (55vh, full width)  │
│                             │
├─────────────────────────────┤
│  Active tab content scrolls │
└─────────────────────────────┘
```

---

## 5. Color tokens

| Token | Hex | Usage |
|--------|-----|--------|
| `--ids-bg-base` | `#0F172A` | App background |
| `--ids-bg-panel` | `#1E293B` | Panel chrome |
| `--ids-bg-elevated` | `#243044` | KPI cards, inputs |
| `--ids-accent` | `#F59E0B` | Brand, CTAs, active states |
| `--ids-zone-severe` | `#EF4444` | Zone 1 · 50% fill |
| `--ids-zone-medium` | `#F59E0B` | Zone 2 · 40% fill |
| `--ids-zone-low` | `#10B981` | Zone 3 · 30% fill |
| `--ids-zone-safe` | `#0284C7` | Zone 4 · 20% fill |
| `--ids-live` | `#10B981` | Engine live indicator |

**Tailwind-equivalent utilities** (if migrating):

```js
// tailwind.config.js extend.colors
ids: {
  base: '#0F172A',
  panel: '#1E293B',
  accent: '#F59E0B',
  zone: {
    severe: '#EF4444',
    medium: '#F59E0B',
    low: '#10B981',
    safe: '#0284C7',
  },
}
```

---

## 6. Typography

| Role | Font | Size | Weight |
|------|------|------|--------|
| UI labels | Inter | 11–14px | 500–600 |
| Panel titles | Inter | 11px uppercase | 600 |
| Metrics / coords | JetBrains Mono | 12–18px | 500–600 |
| KPI values | JetBrains Mono | 18px | 600, tabular-nums |

---

## 7. Component spec sheet

### Segmented control (`ids-segment`)
- VCE / BLEVE toggle
- Active: amber fill `#F59E0B`, dark text
- Inactive: muted on `#0c1220`

### KPI banner (`ids-kpi-grid`)
- 2×2 grid, mono numerics
- TNT equivalent (accent), Peak Pso (psi), Safe distance (m/km), Release energy (MJ)

### Layer chip (`ids-layer-chip`)
- Toggle blast / thermal / fragment overlays
- Active: amber border + tinted background

### Alert card (`ids-alert`)
- Left border accent (amber default, crimson critical)
- Title + plain-language body for emergency guidance

### Range slider (`ids-range`)
- Accent color `#F59E0B`
- Live value in mono, right-aligned on label

---

## 8. UX micro-interactions

| Interaction | Behavior |
|-------------|----------|
| Slider change | Instant recalc → zone rings animate opacity/scale (420ms ease) |
| VCE ↔ BLEVE | Scenario preset swap + map layer mode update |
| Layer toggle | Show/hide vector rings without map reload |
| Export copy | Clipboard scenario summary for incident reports |
| Share URL | Base64-encoded state in query string |
| Print | Browser print → PDF for audit trail |

---

## 9. File map (implementation)

| File | Purpose |
|------|---------|
| `src/design/industrial-tokens.css` | CSS custom properties |
| `src/design/industrial-components.css` | Layout + components |
| `src/components/dashboard/DashboardShell.tsx` | 3-panel shell |
| `src/components/dashboard/ControlPanel.tsx` | Left inputs |
| `src/components/dashboard/AnalyticsPanel.tsx` | Right analytics |
| `src/components/dashboard/KpiBanner.tsx` | Live KPI strip |
| `src/components/dashboard/ModelToggle.tsx` | VCE/BLEVE |
| `src/components/dashboard/ExportBar.tsx` | Share/export |
| `src/utils/exportScenario.ts` | Copy & URL helpers |

---

## 10. Accessibility & safety notes

- Default **dark mode** for control-room contrast
- Zone colors never rely on color alone — labeled Z1–Z4 in legend
- All critical distances shown in **meters** with km fallback > 1000m
- Disclaimer: planning/training tool — not a substitute for site PHA/HAZOP
