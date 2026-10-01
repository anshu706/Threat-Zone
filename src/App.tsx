import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { InputPanel } from './components/InputPanel';
import { ResultsPanel } from './components/ResultsPanel';
import { RiskMap3D as RiskMap } from './components/RiskMap3D';
import { RiskCharts } from './components/RiskCharts';
import { Advisories } from './components/Advisories';
import { RegionSelector } from './components/RegionSelector';
import { StatusTicker } from './components/StatusTicker';
import { ComparisonCharts } from './components/ComparisonCharts';
import { InfoBox } from './components/InfoBox';
import { resetOnboarding } from './components/OnboardingWizard';
import { SiteNavbar } from './components/SiteNavbar';
import { SiteFooter } from './components/SiteFooter';
import { PageSection } from './components/PageSection';
import { DashboardShell } from './components/dashboard/DashboardShell';
import { CustomCursor } from './components/CustomCursor';
import { ThreatZoneHeroBanner } from './components/ThreatZoneHeroBanner';
import { PortfolioDrawerMenu } from './components/PortfolioDrawerMenu';
import { PinnedProjectShowcase } from './components/PinnedProjectShowcase';
import type { ShowcaseProject } from './components/PinnedProjectShowcase';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { runSimulation } from './utils/physics';
import { parseScenarioFromUrl } from './utils/exportScenario';
import { SCENARIOS, HYDROCARBONS } from './constants/data';
import { DEFAULT_REGION, INDIAN_REGIONS } from './constants/regions';
import type { IndianRegion, ScenarioPreset } from './types/physics';
import { Maximize2, X } from 'lucide-react';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Restore initial state from URL if present
  const initialUrlState = useMemo(() => parseScenarioFromUrl(), []);

  const [view, setView] = useState<'landing' | 'dashboard'>(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'dashboard') return 'dashboard';
    if (initialUrlState && (initialUrlState.view === 'dashboard' || initialUrlState.view === 'app')) {
      return 'dashboard';
    }
    return 'landing';
  });

  const [mapExpanded, setMapExpanded] = useState(false);
  const [chartView, setChartView] = useState<'curves' | 'compare'>('curves');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedModalProject, setSelectedModalProject] = useState<ShowcaseProject | null>(null);

  const initialScenario = useMemo(() => {
    if (initialUrlState?.scenarioId) {
      const found = SCENARIOS.find((s) => s.id === initialUrlState.scenarioId);
      if (found) return found;
    }
    return SCENARIOS[0];
  }, [initialUrlState]);

  const initialRegion = useMemo(() => {
    if (initialUrlState?.regionId) {
      const found = INDIAN_REGIONS.find((r) => r.id === initialUrlState.regionId);
      if (found) return found;
    }
    return DEFAULT_REGION;
  }, [initialUrlState]);

  const initialHydrocarbon = useMemo(() => {
    if (initialUrlState?.materialId) {
      const found = HYDROCARBONS.find((h) => h.id === initialUrlState.materialId);
      if (found) return found;
    }
    return HYDROCARBONS.find((h) => h.id === initialScenario.materialId) || HYDROCARBONS[1];
  }, [initialUrlState, initialScenario]);

  useGSAP(
    () => {
      if (view !== 'landing') return;
      gsap.from('.panel-animate', {
        y: 24,
        opacity: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: 'power3.out',
      });
    },
    { scope: containerRef, dependencies: [view] }
  );

  const [darkMode, setDarkMode] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<IndianRegion>(initialRegion);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    document.documentElement.classList.remove('ids-theme');
  }, [darkMode]);

  const [selectedScenario, setSelectedScenario] = useState<ScenarioPreset>(initialScenario);
  const [selectedHydrocarbon, setSelectedHydrocarbon] = useState(initialHydrocarbon);

  const [volume, setVolume] = useState<number>(
    typeof initialUrlState?.volume === 'number' ? initialUrlState.volume : initialScenario.volumeDefault
  );
  const [fillPercent, setFillPercent] = useState<number>(
    typeof initialUrlState?.fillPercent === 'number' ? initialUrlState.fillPercent : initialScenario.fillPercentDefault
  );
  const [pressure, setPressure] = useState<number>(
    typeof initialUrlState?.pressure === 'number' ? initialUrlState.pressure : initialScenario.pressureDefault
  );
  const [temp, setTemp] = useState<number>(
    typeof initialUrlState?.temp === 'number' ? initialUrlState.temp : initialScenario.tempDefault
  );
  const [yieldPercent, setYieldPercent] = useState<number>(
    typeof initialUrlState?.yieldPercent === 'number' ? initialUrlState.yieldPercent : initialScenario.yieldDefault
  );
  const [ambientTemp, setAmbientTemp] = useState<number>(
    typeof initialUrlState?.ambientTemp === 'number' ? initialUrlState.ambientTemp : 25
  );
  const [humidity, setHumidity] = useState<number>(
    typeof initialUrlState?.humidity === 'number' ? initialUrlState.humidity : 50
  );
  const [windSpeed, setWindSpeed] = useState<number>(
    typeof initialUrlState?.windSpeed === 'number' ? initialUrlState.windSpeed : 15
  );
  const [windDirection, setWindDirection] = useState<number>(
    typeof initialUrlState?.windDirection === 'number' ? initialUrlState.windDirection : 240
  );

  const [activeTab, setActiveTab] = useState<'blast' | 'thermal'>('blast');

  useEffect(() => {
    document.body.style.overflow = mapExpanded || isMenuOpen || !!selectedModalProject ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mapExpanded, isMenuOpen, selectedModalProject]);

  const applyScenario = useCallback((scenario: ScenarioPreset) => {
    setSelectedScenario(scenario);
    setVolume(scenario.volumeDefault);
    setFillPercent(scenario.fillPercentDefault);
    setPressure(scenario.pressureDefault);
    setTemp(scenario.tempDefault);
    setYieldPercent(scenario.yieldDefault);

    const fuel = HYDROCARBONS.find((h) => h.id === scenario.materialId);
    if (fuel) setSelectedHydrocarbon(fuel);

    if (scenario.type === 'BLEVE') setActiveTab('thermal');
    else setActiveTab('blast');
  }, []);

  const resetToDefaults = useCallback(() => {
    setSelectedScenario(SCENARIOS[0]);
    setSelectedHydrocarbon(HYDROCARBONS[1]);
    setVolume(SCENARIOS[0].volumeDefault);
    setFillPercent(SCENARIOS[0].fillPercentDefault);
    setPressure(SCENARIOS[0].pressureDefault);
    setTemp(SCENARIOS[0].tempDefault);
    setYieldPercent(SCENARIOS[0].yieldDefault);
    setAmbientTemp(25);
    setHumidity(50);
    setWindSpeed(15);
    setWindDirection(240);
    setActiveTab('blast');
  }, []);

  const simulationResult = useMemo(
    () =>
      runSimulation(
        selectedScenario,
        selectedHydrocarbon,
        volume,
        fillPercent,
        pressure,
        temp,
        yieldPercent,
        ambientTemp,
        humidity
      ),
    [
      selectedScenario,
      selectedHydrocarbon,
      volume,
      fillPercent,
      pressure,
      temp,
      yieldPercent,
      ambientTemp,
      humidity,
    ]
  );

  const handleRestartTour = useCallback(() => {
    resetOnboarding();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (view === 'dashboard') {
    return (
      <DashboardShell
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onRestartTour={handleRestartTour}
        onBackToLanding={() => setView('landing')}
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
        explosionModel={selectedScenario.type === 'BLEVE' ? 'BLEVE' : 'VCE'}
        onModelChange={(model) => {
          const next = SCENARIOS.find((s) => s.type === model);
          if (next) applyScenario(next);
        }}
        selectedScenario={selectedScenario}
        onScenarioChange={applyScenario}
        selectedHydrocarbon={selectedHydrocarbon}
        onHydrocarbonChange={setSelectedHydrocarbon}
        volume={volume}
        setVolume={setVolume}
        fillPercent={fillPercent}
        setFillPercent={setFillPercent}
        pressure={pressure}
        setPressure={setPressure}
        temp={temp}
        setTemp={setTemp}
        yieldPercent={yieldPercent}
        ambientTemp={ambientTemp}
        setAmbientTemp={setAmbientTemp}
        humidity={humidity}
        setHumidity={setHumidity}
        windSpeed={windSpeed}
        setWindSpeed={setWindSpeed}
        windDirection={windDirection}
        setWindDirection={setWindDirection}
        result={simulationResult}
        onReset={resetToDefaults}
        exportParams={{
          site: selectedRegion.id,
          model: selectedScenario.type === 'BLEVE' ? 'BLEVE' : 'VCE',
          scenario: selectedScenario.id,
          fuel: selectedHydrocarbon.id,
          volume,
          fillPercent,
          pressure,
          temp,
          yieldPercent,
          ambientTemp,
          humidity,
          windSpeed,
          windDirection,
          view: 'dashboard',
        }}
      />
    );
  }

  return (
    <div ref={containerRef} className="tz-site">
      {/* DreamHouse Inverted Difference Cursor */}
      <CustomCursor />

      {/* DreamHouse Portfolio Directory Drawer */}
      <PortfolioDrawerMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onSelectFacility={(regionId) => {
          const found = INDIAN_REGIONS.find((r) => r.id === regionId);
          if (found) setSelectedRegion(found);
          scrollTo('map');
        }}
        onSelectScenario={(scenarioId) => {
          const found = SCENARIOS.find((s) => s.id === scenarioId);
          if (found) applyScenario(found);
          scrollTo('simulator');
        }}
      />

      {/* DreamHouse 50/50 Detail Modal */}
      <ProjectDetailModal
        project={selectedModalProject}
        onClose={() => setSelectedModalProject(null)}
        onLaunch={(p) => {
          const r = INDIAN_REGIONS.find((x) => x.id === p.regionId);
          if (r) setSelectedRegion(r);
          const s = SCENARIOS.find((x) => x.id === p.scenarioId);
          if (s) applyScenario(s);
          setSelectedModalProject(null);
          scrollTo('simulator');
        }}
      />

      {/* DreamHouse Fixed Header */}
      <SiteNavbar
        onLaunchDashboard={() => setView('dashboard')}
        onOpenMenu={() => setIsMenuOpen(!isMenuOpen)}
        isMenuOpen={isMenuOpen}
      />

      <main className="tz-main">
        {/* DreamHouse Hero Banner with SVG Cutout Mask */}
        <ThreatZoneHeroBanner
          selectedRegion={selectedRegion}
          selectedScenario={selectedScenario}
          result={simulationResult}
          onRunSimulator={() => scrollTo('simulator')}
          onExploreScenarios={() => scrollTo('scenarios')}
          onLaunchDashboard={() => setView('dashboard')}
        />

        {/* Live Status Ticker */}
        <StatusTicker
          result={simulationResult}
          selectedScenario={selectedScenario}
          selectedRegion={selectedRegion}
        />

        {/* DreamHouse Pinned Fullscreen Showcase Projects */}
        <PinnedProjectShowcase
          onInspect={(project) => setSelectedModalProject(project)}
          onLaunchLive={(project) => {
            const r = INDIAN_REGIONS.find((x) => x.id === project.regionId);
            if (r) setSelectedRegion(r);
            const s = SCENARIOS.find((x) => x.id === project.scenarioId);
            if (s) applyScenario(s);
            scrollTo('simulator');
          }}
        />

        {/* World Radar Map Section */}
        <PageSection
          id="map"
          num="01 / Live Radar"
          title="Indian Energy Facilities & Blast Contour Map"
          lead="Satellite consequence map tracking 10 high-consequence refineries. Real-time blast overpressure (PSI) & thermal radiation (kW/m²) zones."
          variant="muted"
        >
          <div className={`tz-map-block panel-animate ${mapExpanded ? 'tz-map-block-expanded' : ''}`}>
            <div className="tz-map-toolbar">
              <span className="tz-map-toolbar-title">Active Facility · {selectedRegion.name} ({selectedRegion.state})</span>
              <button type="button" className="expand-map-btn" onClick={() => setMapExpanded(!mapExpanded)}>
                {mapExpanded ? (
                  <>
                    <X className="w-3.5 h-3.5" /> Exit fullscreen
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" /> Fullscreen map
                  </>
                )}
              </button>
            </div>
            <RiskMap
              result={simulationResult}
              selectedScenario={selectedScenario}
              selectedRegion={selectedRegion}
              darkMode={darkMode}
              onSelectRegion={setSelectedRegion}
              windDirection={windDirection}
              windSpeedKph={windSpeed}
              ambientTemp={ambientTemp}
              humidity={humidity}
            />
          </div>
        </PageSection>

        {/* Integrated Physics Simulator */}
        <PageSection
          id="simulator"
          num="02 / Live Physics Engine"
          title="Configure Facility & Consequence Parameters"
          lead="Select a target facility, choose the catastrophic release mechanism, and tune operating pressures, temperatures, and vessel fill percentages."
        >
          <div className="tz-simulator-grid panel-animate">
            <div className="tz-simulator-stack">
              <InfoBox title="Step 1 — Choose Facility">
                Select one of 10 Indian refineries, LNG terminals, or petrochemical crackers.
              </InfoBox>
              <RegionSelector selectedRegion={selectedRegion} onSelect={setSelectedRegion} />
            </div>
            <div className="tz-simulator-stack">
              <InfoBox title="Step 2 — Physics Parameters">
                Scenario type, hydrocarbon material, vessel volume, operating pressure, temperature, and atmospheric conditions.
              </InfoBox>
              <InputPanel
                selectedHydrocarbon={selectedHydrocarbon}
                setSelectedHydrocarbon={setSelectedHydrocarbon}
                selectedScenario={selectedScenario}
                setSelectedScenario={applyScenario}
                volume={volume}
                setVolume={setVolume}
                fillPercent={fillPercent}
                setFillPercent={setFillPercent}
                pressure={pressure}
                setPressure={setPressure}
                temp={temp}
                setTemp={setTemp}
                yieldPercent={yieldPercent}
                setYieldPercent={setYieldPercent}
                ambientTemp={ambientTemp}
                setAmbientTemp={setAmbientTemp}
                humidity={humidity}
                setHumidity={setHumidity}
                onReset={resetToDefaults}
              />
            </div>
          </div>
        </PageSection>

        {/* Results Panel */}
        <PageSection
          id="results"
          num="03 / Impact Assessment"
          title="Consequence & Damage Assessment"
          lead="Calculated blast shock strength, structural destruction boundaries, and safe public evacuation perimeters."
          variant="muted"
        >
          <div className="panel-animate">
            <ResultsPanel result={simulationResult} selectedScenario={selectedScenario} />
          </div>
        </PageSection>

        {/* Hazard Curves & Analytics */}
        <PageSection
          id="charts"
          num="04 / Quantitative Analytics"
          title="Hazard Decay Curves & Environmental Sensitivity"
          lead="Evaluate distance decay profiles for peak overpressure and thermal flux across varying ambient temperatures and wind conditions."
        >
          <div className="panel-animate">
            <div className="tz-chart-tabs">
              <button
                type="button"
                className={`tz-chart-tab ${chartView === 'curves' ? 'tz-chart-tab-active' : ''}`}
                onClick={() => setChartView('curves')}
              >
                Hazard Curves
              </button>
              <button
                type="button"
                className={`tz-chart-tab ${chartView === 'compare' ? 'tz-chart-tab-active' : ''}`}
                onClick={() => setChartView('compare')}
              >
                Compare & Environment
              </button>
            </div>

            {chartView === 'curves' ? (
              <div className="ca-panel">
                <div className="ca-tabs" style={{ marginBottom: '1rem' }}>
                  <div className="flex">
                    <button
                      type="button"
                      onClick={() => setActiveTab('blast')}
                      className={`ca-tab ${activeTab === 'blast' ? 'ca-tab-active' : ''}`}
                    >
                      Blast Overpressure (PSI)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('thermal')}
                      disabled={selectedScenario.type !== 'BLEVE'}
                      className={`ca-tab ${activeTab === 'thermal' ? 'ca-tab-active' : ''}`}
                    >
                      Thermal Radiation (kW/m²)
                    </button>
                  </div>
                </div>
                <RiskCharts
                  result={simulationResult}
                  selectedScenario={selectedScenario}
                  ambientTemp={ambientTemp}
                  humidity={humidity}
                  activeTab={activeTab}
                />
              </div>
            ) : (
              <ComparisonCharts
                result={simulationResult}
                selectedScenario={selectedScenario}
                selectedHydrocarbon={selectedHydrocarbon}
                selectedRegion={selectedRegion}
                volume={volume}
                fillPercent={fillPercent}
                pressure={pressure}
                temp={temp}
                yieldPercent={yieldPercent}
                ambientTemp={ambientTemp}
                humidity={humidity}
              />
            )}
          </div>
        </PageSection>

        {/* Emergency Advisories */}
        <PageSection
          id="safety"
          num="05 / Action Protocol"
          title="Emergency Protocols & OISD Guidelines"
          lead="Automated mitigation strategies, operator actions, and OISD safety standard compliance protocols."
          variant="muted"
        >
          <div className="panel-animate">
            <Advisories selectedScenario={selectedScenario} />
          </div>
        </PageSection>
      </main>

      {/* DreamHouse Editorial Footer */}
      <SiteFooter />
    </div>
  );
}

export default App;
