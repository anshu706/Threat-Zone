# ⚡ Threat Zone

<div align="center">


### 🎬 Launch Video Walkthrough

<video src="brag-output/brag.mp4" controls="controls" muted="muted" poster="assets/poster.jpg" width="100%" style="max-height: 600px; border-radius: 12px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);">
  <p>Your browser does not support HTML5 video. <a href="assets/constructiq-demo.mp4"><b>Click here to view or download the demo video</b></a>.</p>
</video>

### **Industrial Process Safety & Consequence Modeling Engine**
*Real-time VCE & BLEVE consequence visualizer for Indian oil & gas refineries, petrochemical complexes, and chemical facilities.*

[![React 19](https://img.shields.io/badge/React-19.2-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Deck.gl](https://img.shields.io/badge/Deck.gl-9.4-000000?style=for-the-badge&logo=uber&logoColor=white)](https://deck.gl/)
[![GSAP 3](https://img.shields.io/badge/GSAP-3.15-88ce02?style=for-the-badge&logo=greensock&logoColor=white)](https://greensock.com/gsap/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

[Launch Simulator](#-getting-started) • [Watch Demo](#-product-launch-video) • [Physics Architecture](#-consequence-physics-engine) • [Refinery Presets](#-indian-refinery-presets) • [Design System](#-control-room-design-system)

</div>

---

## 🎬 Product Launch Video

<div align="center">

<video src="brag-output/brag.mp4" poster="brag-output/brag.jpg" width="100%" autoplay loop muted playsinline controls>
  <source src="brag-output/brag.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

</div>

---

## 📌 Overview

Industrial consequence modeling has traditionally been confined to rigid, legacy desktop software, complex spreadsheets, and static PDF reports. 

**Threat Zone** redefines process safety engineering by bringing high-precision computational consequence modeling into an ultra-fast, military-grade control room interface. It computes blast wave overpressure propagation, TNT equivalency, thermal radiation fluxes, and structural damage radii on **real satellite maps with sub-second feedback**.

Designed for **Process Safety Engineers (HSE)**, **Emergency Response Teams (ERT)**, **Plant Operations Managers**, and **Industrial Safety Trainees**.

---

## ✨ Key Features

- 💥 **Dual Explosion Mechanics**: Toggle seamlessly between **Vapor Cloud Explosion (VCE)** and **Boiling Liquid Expanding Vapor Explosion (BLEVE)**.
- 🗺️ **3D & 2D GIS Satellite Canvas**: High-resolution satellite mapping powered by **Deck.gl & Leaflet** with smooth panning, coordinate reticles, and facility epicenters.
- 🎯 **Concentric 4-Zone Hazard Classification**:
  - 🔴 **Zone 1 (Severe / Fatal)**: $>10.0\text{ psi}$ / $>37.5\text{ kW/m}^2$ — Total structural collapse & lethal thermal exposure.
  - 🟠 **Zone 2 (Heavy Damage)**: $5.0\text{–}10.0\text{ psi}$ / $25.0\text{ kW/m}^2$ — Heavy equipment displacement & second-degree burns.
  - 🟢 **Zone 3 (Moderate / Repairable)**: $1.0\text{–}5.0\text{ psi}$ / $12.5\text{ kW/m}^2$ — Minor structural repair & first-degree burn threshold.
  - 🔵 **Zone 4 (Safe Boundary)**: $0.3\text{–}1.0\text{ psi}$ / $4.7\text{ kW/m}^2$ — Window glass breakage perimeter / minimum safe evacuation line.
- 🧭 **Atmospheric & Dispersion Couplings**: Live wind vector compass ($^{\circ}\text{azimuth}$ + speed in $\text{km/h}$), ambient temperature, and relative humidity adjustments.
- 📊 **Distance-Decay Analytical Curves**: Dynamic Cartesian charts showing Peak Overpressure ($P_{so}$) vs. radial distance ($R$) with live cursor inspection.
- 📋 **Emergency Protocols & Safety Advisories**: Instant plain-language evacuation mandates and facility safety guidelines aligned with **OISD** & **OSHA PSM** standards.
- 🔗 **Zero-Backend State Sharing**: Encode complete accident scenarios into URL hash strings (`Base64`) for instant collaboration across response teams.

---

## 🔬 Consequence Physics Engine

Threat Zone implements industry-standard consequence modeling methodologies based on the **Center for Chemical Process Safety (CCPS)** guidelines:

### 1. Vapor Cloud Explosion (VCE)
Computes equivalent TNT mass based on fuel mass, heat of combustion, and explosion efficiency factor ($\eta$):

$$M_{\text{TNT}} = \frac{\eta \cdot M_{\text{fuel}} \cdot \Delta H_c}{E_{\text{TNT}}}$$

*Where:*
- $\eta$ = Yield fraction ($3\%\text{--}10\%$ empirical cloud reactivity)
- $\Delta H_c$ = Lower heating value of hydrocarbon ($\text{MJ/kg}$)
- $E_{\text{TNT}}$ = Reference TNT blast energy ($4.68\times 10^6\text{ J/kg}$)

**Scaled Distance & Peak Overpressure ($P_{so}$):**
$$Z = \frac{R}{(M_{\text{TNT}})^{1/3}}$$

$$P_{so} = \frac{101.3}{Z} \left[ 1 + \left(\frac{Z}{0.28}\right)^{-2} + \left(\frac{Z}{0.85}\right)^{-1} \right]$$

### 2. BLEVE Fireball & Thermal Radiation
When pressurized hydrocarbons undergo catastrophic vessel rupture, the resulting BLEVE fireball dimensions and duration are computed via empirical relations:

- **Maximum Fireball Diameter ($D_{\text{max}}$)**:
  $$D_{\text{max}} = 5.8 \cdot M_{\text{fuel}}^{1/3} \quad (\text{meters})$$
- **Burn Duration ($t_b$)**:
  $$t_b = 0.45 \cdot M_{\text{fuel}}^{1/3} \quad (\text{seconds})$$
- **Surface Emissive Power (SEP)**:
  $$E_{\text{rad}} = \tau_{\text{atm}} \cdot F_{\text{view}} \cdot \text{SEP} \quad (\text{kW/m}^2)$$

---

## 🏭 Indian Refinery Presets

Threat Zone comes pre-configured with exact GIS coordinates and operational parameters for India's major petrochemical installations:

| Facility Name | Operator | Coordinates | Primary Hydrocarbons |
|---|---|---|---|
| **Jamnagar Refining Complex** | Reliance Industries (RIL) | `22.4707°N, 69.8384°E` | Propylene, Ethylene, LPG, Reformate |
| **Vadodara Refinery (Koyali)** | Indian Oil Corp (IOCL) | `22.3686°N, 73.1232°E` | Naphtha, Butadiene, Propane, Crude |
| **Mangalore Refinery (MRPL)** | ONGC / MRPL | `12.9922°N, 74.8211°E` | Heavy Fuel Oil, LPG, Kerosene |
| **Visakhapatnam Refinery** | HPCL | `17.6974°N, 83.2564°E` | Motor Spirit, Diesel, High-Octane Blend |
| **Mumbai Refineries (Mahul)** | BPCL / HPCL | `19.0068°N, 72.8986°E` | Aviation Turbine Fuel, Hexane, LPG |
| **Kochi Refinery (Ambalamugal)**| BPCL | `9.9723°N, 76.3687°E` | Petrochemicals, Propylene derivatives |

---

## 🎨 Control Room Design System

Built on a bespoke dark mode aesthetic designed for control room clarity, low eye strain, and high contrast during emergency operations.

| Token | Hex Value | Application |
|---|---|---|
| `--ids-bg-base` | `#0F172A` | Primary control room canvas |
| `--ids-bg-panel` | `#1E293B` | Structural chrome and instrumentation panels |
| `--ids-bg-elevated` | `#243044` | KPI cards and interactive parameter boxes |
| `--ids-accent` | `#F59E0B` | Industrial safety amber (active states & CTAs) |
| `--ids-zone-severe` | `#EF4444` | Zone 1 fatal overpressure / thermal threshold |
| `--ids-zone-medium` | `#F59E0B` | Zone 2 structural failure threshold |
| `--ids-zone-low` | `#10B981` | Zone 3 minor damage perimeter |
| `--ids-zone-safe` | `#0284C7` | Zone 4 public evacuation line |

---

## 🛠️ Architecture & Tech Stack

```
ThreatZoneApp
├── OnboardingWizard (First-run engineer orientation)
└── DashboardShell
    ├── TopBar (Facility badge, Live engine indicator, PDF/URL export)
    └── ThreePanelGrid
        ├── ControlPanel (Left)
        │   ├── SiteSelect & FuelSelect
        │   ├── ModelToggle [ VCE | BLEVE ]
        │   ├── ParameterSliders (Pressure, Temp, Volume, Fill %, Wind)
        │   └── KpiBanner (TNT Eq, Peak Pso, Safe distance, Energy)
        ├── MapCanvas (Center)
        │   ├── LayerChips (Blast · Thermal · Fragment)
        │   ├── WindCompass (Azimuth vector display)
        │   └── RiskMap (Deck.gl 3D / Leaflet Satellite + Zone Rings)
        └── AnalyticsPanel (Right)
            ├── RiskCharts (Overpressure distance-decay curve)
            ├── ComparisonCharts (Environment & fuel comparison)
            └── Advisories & EmergencyAlertCards
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `>= 20.0.0` (Tested on Node 24)
- **Package Manager**: `npm` or `pnpm`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/anshu706/Threat-Zone.git
   cd Threat-Zone
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Lint and code quality:**
   ```bash
   npm run lint
   ```

---

## 🛡️ Safety Disclaimer

> **IMPORTANT**: *Threat Zone is designed for incident pre-planning, consequence visualization, training, and educational safety awareness. It is not an automated replacement for formal site-specific Quantitative Risk Assessments (QRA), Process Hazard Analyses (PHA), or HAZOP studies conducted in accordance with statutory guidelines.*

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">

**Threat Zone** • Built for Indian Industrial Process Safety
*Model blast & fire risk at Indian refineries. Live. Accurate. Emergency-ready.*

</div>
