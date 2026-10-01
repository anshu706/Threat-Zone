# ⚡ THREAT ZONE — Industrial Hazard & Consequence Modeling Platform

<div align="center">

[![React 19](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript%206-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite%208-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

<p align="center">
  <strong>High-precision VCE & BLEVE blast consequence visualizer and emergency perimeter planner for Indian refineries, petrochemical hubs, and LNG terminals.</strong>
</p>

[✨ Live Demo](https://threat-zone.vercel.app/) • [🔬 Physics Engine](#-mathematical--physics-foundations) • [🏭 Indian Facility Library](#-modeled-indian-facilities) • [📊 Hazard Zonation](#-four-tier-hazard-zonation-matrix) • [🏗️ Architecture](#-system-architecture) • [🚀 Quick Start](#-quick-start)

---

</div>

## 📌 Executive Summary

Hydrocarbon storage and processing facilities operate under extreme pressure and thermodynamic risk. Traditional safety consequence modeling often relies on cumbersome desktop software or static calculation sheets that cannot provide instant, real-time spatial awareness during plant drills, hazard reviews (HAZOP/PHA), or emergency response briefings.

**Threat Zone** is an ultra-fast, client-side, interactive industrial safety simulation platform tailored specifically to Indian oil, gas, and petrochemical infrastructure. It computes **Vapor Cloud Explosions (VCE)** and **Boiling Liquid Expanding Vapor Explosions (BLEVE)** in real time, projecting dynamic 4-tier hazard zones over high-resolution satellite GIS maps.

```
       [ HIGH-PRESSURE LOSS OF CONTAINMENT ]
                        │
         ┌──────────────┴──────────────┐
         ▼                             ▼
   [ VCE SCENARIOS ]            [ BLEVE SCENARIOS ]
   • Liquid Trapping            • Pressure Vessel Fire Exposure
   • Underfilled Headspace      • Flash Fraction & Aerosolization
   • Rapid Fill Splash Spark    • Fireball Growth & Thermal Radiance
         │                             │
         ▼                             ▼
 [ KINNEY-GRAHAM OVERPRESSURE ]  [ CCPS SOLID-FLAME & TRANSMISSIVITY ]
         └──────────────┬──────────────┘
                        ▼
    [ REAL-TIME MULTI-ZONE GEOSPATIAL MAP & ADVISORIES ]
    (Zone 1: Severe | Zone 2: Heavy | Zone 3: Moderate | Zone 4: Public Safe)
```

---

## 🌟 Key Highlights & Innovations

- **⚡ Client-Side Physics Engine (Zero-Latency)**: High-precision numerical evaluation of blast overpressures and radiant thermal fluxes directly in the browser—works in disconnected plant control rooms and field tablets.
- **🛰️ Geospatial 2D/3D Multi-Layer Mapping**: Interactive satellite GIS rendering via **Leaflet** & **Deck.gl / MapLibre** with instant perimeter scaling and directional wind drift modeling.
- **🇮🇳 Curated Indian Facility Presets**: Pre-configured geocoordinates, workforce estimates, and atmospheric baselines for major refineries (Jamnagar, Mumbai, Panipat, Kochi, Visakhapatnam, Mathura, Hazira, etc.).
- **🔥 Multi-Hydrocarbon Thermophysical Matrix**: Real-time stoichiometric, density, and combustion enthalpy modeling for Methane, Propane, Benzene, Gasoline, Crude Oil, and Heavy Fuel Oil.
- **📈 Real-Time Analytics & Distance-Decay Curves**: Live Recharts graphs for blast overpressure decay ($\Delta P_{so}$ vs. distance) and thermal heat flux ($q''$ vs. distance).
- **📋 Incident Sharing & Audit-Ready Export**: One-click URL scenario serialization (Base64), clipboard report summaries for shift handover, and clean PDF print layouts.
- **🎨 Control-Room Industrial UI/UX**: High-contrast, dark-mode ergonomics engineered to reduce cognitive overload under emergency triage scenarios.

---

## 🔬 Mathematical & Physics Foundations

Threat Zone computes physical and chemical release consequences using empirical and semi-empirical thermodynamic equations verified against industry benchmarks (*CCPS*, *TNO Yellow Book*, *API 521*).

### 1. Kinney-Graham Blast Wave Overpressure (VCE)

For vapor cloud explosions and vessel ruptures, the peak side-on overpressure ratio $P_s / P_0$ at standoff distance $R$ is calculated using the **Kinney-Graham formulation** as a function of scaled distance $Z$:

$$Z = \frac{R}{W_{\text{TNT}}^{1/3}}$$

$$\frac{P_s}{P_0} = \frac{808 \left[1 + \left(\frac{Z}{4.5}\right)^2\right]}{\sqrt{1 + \left(\frac{Z}{0.048}\right)^2} \cdot \sqrt{1 + \left(\frac{Z}{0.32}\right)^2} \cdot \sqrt{1 + \left(\frac{Z}{1.35}\right)^2}}$$

Where:
- $W_{\text{TNT}} = \frac{\eta \cdot M_{\text{fuel}} \cdot \Delta H_c}{E_{\text{TNT}}}$ (with $E_{\text{TNT}} = 4.68\text{ MJ/kg}$ and $\eta$ = blast yield factor)
- $P_0$ is ambient atmospheric pressure ($1.01325\text{ bar}$)

### 2. Flashing Liquid Fraction (Buck's Saturation Model)

When superheated pressurized hydrocarbons are released to atmospheric conditions:

$$f_{\text{flash}} = \frac{C_p \cdot (T_{\text{liquid}} - T_{\text{boiling}})}{\Delta H_v}$$

Saturation vapor pressure is resolved via Buck's equation:

$$P_{\text{sat}}(T) = 611.21 \times \exp\left(\frac{17.67 \cdot T}{T + 243.5}\right)\text{ [Pa]}$$

### 3. BLEVE Fireball & Thermal Radiation Flux

For catastrophic vessel rupture with BLEVE fireball formation:

| Parameter | Formula | Description |
| :--- | :--- | :--- |
| **Fireball Diameter ($D_{\text{max}}$)** | $D = 5.8 \cdot M_{\text{involved}}^{1/3}$ | Maximum fireball sphere diameter in meters |
| **Duration ($t_{\text{fireball}}$)** | $t = 0.45 \cdot M_{\text{involved}}^{1/3}$ | Total combustion duration in seconds |
| **Surface Emissive Power ($E_{\text{sep}}$)** | $\sim 200 - 350\text{ kW/m}^2$ | Radiative power based on fuel carbon chain |

The thermal flux $q''$ arriving at distance $R$ accounts for geometric view factor $F$ and atmospheric moisture absorption transmissivity $\tau_a$:

$$q''(R) = E_{\text{sep}} \cdot F_{\text{geom}} \cdot \tau_a$$

$$\tau_a = 2.02 \times \left[ P_w \cdot \left(R - \frac{D}{2}\right) \right]^{-0.09}$$

Where $P_w = \text{RH} \times P_{\text{sat}}(T_{\text{ambient}})$.

---

## 📊 Four-Tier Hazard Zonation Matrix

Threat Zone maps safety thresholds into standardized color-coded industrial impact tiers:

```
┌────────────────────────────────────────────────────────────────────────┐
│                              ZONE LAYERS                               │
├────────┬─────────────────┬──────────────┬──────────────┬───────────────┤
│ Zone   │ Severity Level  │ Blast Limit  │ Thermal Flux │ Consequence   │
├────────┼─────────────────┼──────────────┼──────────────┼───────────────┤
│ Zone 1 │ 🔴 Total Destr. │ ≥ 0.70 bar   │ ≥ 37.5 kW/m² │ 100% Fatal /  │
│        │    (#EF4444)    │ (10.15 psi)  │              │ Steel Collapse│
├────────┼─────────────────┼──────────────┼──────────────┼───────────────┤
│ Zone 2 │ 🟠 Heavy Damage │ ≥ 0.30 bar   │ ≥ 12.5 kW/m² │ Severe Injury │
│        │    (#F59E0B)    │ (4.35 psi)   │              │ 2nd-Deg Burns │
├────────┼─────────────────┼──────────────┼──────────────┼───────────────┤
│ Zone 3 │ 🟢 Moderate     │ ≥ 0.10 bar   │ ≥ 4.0 kW/m²  │ Glass & Wall  │
│        │    (#10B981)    │ (1.45 psi)   │              │ Breakage      │
├────────┼─────────────────┼──────────────┼──────────────┼───────────────┤
│ Zone 4 │ 🔵 Safe Boundary│ ≥ 0.02 bar   │ ≥ 1.0 kW/m²  │ Public Safe   │
│        │    (#0284C7)    │ (0.29 psi)   │              │ Perimeter     │
└────────┴─────────────────┴──────────────┴──────────────┴───────────────┘
```

---

## 🏭 Modeled Indian Facilities

Threat Zone comes loaded with geographic and operational data for key national energy hubs:

| Facility Name | Location | Operator | Type | Capacity | Baseline Workforce |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Jamnagar Complex** | Gujarat (22.348° N, 69.873° E) | Reliance Industries | Refinery / Petrochem | 1.4 MMbpd | ~4,280 |
| **HPCL Mumbai Refinery** | Maharashtra (19.012° N, 72.868° E) | HPCL | Refinery | 9.5 MMTPA | ~3,640 |
| **IOCL Panipat Refinery** | Haryana (29.316° N, 76.968° E) | Indian Oil Corp | Refinery | 15 MMTPA | ~2,180 |
| **BPCL Kochi Refinery** | Kerala (9.968° N, 76.245° E) | BPCL | Refinery / Petrochem | 15.5 MMTPA | ~1,920 |
| **HPCL Visakh Refinery** | Andhra Pradesh (17.686° N, 83.218° E) | HPCL | Refinery | 8.3 MMTPA | ~1,680 |
| **IOCL Mathura Refinery** | Uttar Pradesh (27.492° N, 77.673° E) | Indian Oil Corp | Refinery | 8.0 MMTPA | ~1,420 |
| **Hazira LNG & Petrochem** | Gujarat (21.133° N, 72.652° E) | ONGC / Shell | LNG / Petrochemical | 5 MMTPA LNG | ~980 |
| **BPCL Bina Refinery** | Madhya Pradesh (24.032° N, 78.182° E) | Bharat Oman / BPCL | Refinery | 7.8 MMTPA | ~1,250 |
| **IOCL Paradip Complex** | Odisha (20.283° N, 86.621° E) | Indian Oil Corp | Refinery | 15 MMTPA | ~2,400 |
| **MRPL Mangalore** | Karnataka (12.986° N, 74.832° E) | ONGC / MRPL | Refinery | 15 MMTPA | ~1,850 |

---

## 🏗️ System Architecture

```mermaid
graph TD
    subgraph UI_Layer [Industrial Control Room UI (React 19 + GSAP)]
        Nav[Navbar & Facility Selector]
        Controls[Control Panel: Sliders for P, T, Volume, Fill %]
        Toggle[Model Selector: VCE / BLEVE / Liquid Trapping]
        Kpis[Live KPI Strip: TNT Tons, Overpressure, Safe Dist]
    end

    subgraph Physics_Engine [Client-Side Physics Engine (physics.ts)]
        Flash[Flash Fraction & Liquid Expansion Calculator]
        GasExp[Pneumatic Gas Expansion Energy Model]
        Kinney[Kinney-Graham Overpressure Solver]
        Bleve[BLEVE Fireball & Thermal Flux Solver]
        Atm[Buck Equation & CCPS Transmissivity Module]
    end

    subgraph Geospatial_Analytics [Geospatial & Visualization Layer]
        Map[Leaflet / Deck.gl 3D Multi-Zone Overlays]
        Curves[Recharts Distance-Decay & Comparative Curves]
        Advisory[Plain-Language Emergency Directives Engine]
        Export[Base64 URL Serialization & PDF Exporter]
    end

    Controls -->|Raw Parameters| Physics_Engine
    Toggle -->|Scenario Logic| Physics_Engine
    Physics_Engine -->|Simulation Result| Kpis
    Physics_Engine -->|Zone Radii (Z1-Z4)| Map
    Physics_Engine -->|Curve Coordinates| Curves
    Physics_Engine -->|Threshold Crossings| Advisory
```

---

## 💻 Tech Stack & Design System

### Core Technologies
- **Runtime & Framework**: [React 19](https://react.dev/), [TypeScript 6](https://www.typescriptlang.org/), [Vite 8](https://vitejs.dev/)
- **GIS Mapping**: [Leaflet](https://leafletjs.com/), [React Leaflet](https://react-leaflet.js.org/), [MapLibre GL](https://maplibre.org/), [Deck.gl](https://deck.gl/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Motion & UI Dynamics**: [GSAP](https://greensock.com/gsap/), [@gsap/react](https://www.npmjs.com/package/@gsap/react)
- **Styling**: Tailwind CSS v4 + Industrial UI Custom Properties (`industrial-tokens.css`)
- **Iconography**: [Lucide React](https://lucide.dev/)

### Industrial Design Tokens
Threat Zone implements the strict **Industrial Design System (IDS)** specification:
- Background: `#0F172A` (Deep Slate Slate base)
- Control Surface: `#1E293B` (Console panel chrome)
- Brand Accent: `#F59E0B` (High-visibility Safety Amber)
- Monospace Data: `JetBrains Mono` for tabular telemetry and blast metrics

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or yarn/pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/anshu706/threat-zone.git
   cd threat-zone
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Run linter / validation:**
   ```bash
   npm run lint
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📁 Repository Directory Structure

```plaintext
Threat-Zone/
├── public/                     # Static assets, facility showcases & icons
│   ├── favicon.svg             # Application vector brand mark
│   └── showcase/               # Facility satellite photography
│       ├── jamnagar.jpg
│       ├── kochi.jpg
│       ├── panipat.jpg
│       └── bleve.jpg
├── scripts/                    # Automation & Presentation generators
│   └── generate_sih_ppt.py     # SIH 2025 slide deck generator (python-pptx)
├── src/
│   ├── assets/                 # SVGs and static brand assets
│   ├── components/             # Reusable UI widgets & sections
│   │   ├── dashboard/          # Control room 3-panel shell components
│   │   │   ├── ControlPanel.tsx
│   │   │   ├── AnalyticsPanel.tsx
│   │   │   ├── DashboardShell.tsx
│   │   │   ├── KpiBanner.tsx
│   │   │   └── ModelToggle.tsx
│   │   ├── Advisories.tsx      # Emergency actionable directives
│   │   ├── ComparisonCharts.tsx# Multi-variable environmental sensitivity
│   │   ├── RiskCharts.tsx      # Distance vs Overpressure/Thermal curves
│   │   ├── RiskMap.tsx         # Leaflet 2D GIS visualizer
│   │   ├── RiskMap3D.tsx       # Deck.gl 3D accelerated hazard map
│   │   └── OnboardingWizard.tsx# First-run operator guidance tour
│   ├── constants/
│   │   ├── data.ts             # Hydrocarbons, Scenarios & Blast thresholds
│   │   └── regions.ts          # 10 Indian refinery coordinates & data
│   ├── design/
│   │   ├── industrial-tokens.css     # CSS custom variables & dark theme
│   │   └── industrial-components.css # Layout grids & panel styling
│   ├── types/
│   │   └── physics.ts          # TypeScript interfaces for simulation models
│   ├── utils/
│   │   ├── physics.ts          # Core numerical math & blast wave formulas
│   │   ├── exportScenario.ts   # Base64 state sharing & copy helpers
│   │   └── plainLanguage.ts    # Actionable safety wording transformers
│   ├── App.tsx                 # Main application controller
│   └── main.tsx                # React root entry point
├── DESIGN_SYSTEM.md            # UX/UI token specification document
├── package.json                # Project dependencies and npm scripts
└── vite.config.ts              # Vite configuration
```

---

## 🛡️ Regulatory Standards & Safety Disclaimer

> [!IMPORTANT]
> **Industrial Planning & Academic Tool Notice**:
> Threat Zone is developed as an interactive screening, educational, and drills-planning prototype for **Smart India Hackathon (SIH 2025)**. While calculations employ established thermodynamic standards (Kinney-Graham, CCPS, TNO Yellow Book, OISD-116), this application does **not** substitute for certified Process Hazard Analyses (PHA), Quantitative Risk Assessments (QRA), or computational fluid dynamics (CFD) modeling required for statutory compliance.

---

## 🏆 Smart India Hackathon (SIH 2025)

Threat Zone is architected to address industrial disaster mitigation and energy sector safety in India.

- **Theme**: Disaster Management / Clean & Green Technology
- **Domain**: Software / Process Safety & Emergency Response
- **Goal**: Provide rapid, browser-based consequence assessment tools to empower plant operators, disaster management authorities, and emergency response teams across the nation.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/NewHazardModel`)
3. Commit your Changes (`git commit -m 'Add support for Atmospheric Dispersion (Gaussian Plume)'`)
4. Push to the Branch (`git push origin feature/NewHazardModel`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<div align="center">
  <sub>Engineered with precision for safer industrial operations across India.</sub>
</div>
