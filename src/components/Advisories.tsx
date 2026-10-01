import React from 'react';
import type { ScenarioPreset } from '../types/physics';
import { InfoBox } from './InfoBox';

interface AdvisoriesProps {
  selectedScenario: ScenarioPreset;
}

export const Advisories: React.FC<AdvisoriesProps> = ({ selectedScenario }) => {
  const getAdvisories = () => {
    switch (selectedScenario.id) {
      case 'liquid_trapping':
        return {
          title: 'Liquid trapped between valves',
          hazard:
            'Liquid stuck in a pipe can heat up and burst the pipe. When it breaks, fuel vapor escapes and can explode.',
          engineeringControls: [
            'Install relief valves on pipe sections that can be closed off.',
            'Send relief lines to a safe flare or low-pressure header — not open air.',
            'Use valves that release pressure if trapped liquid expands.',
          ],
          procedures: [
            'Drain pipes before locking valves closed (LOTO).',
            'Check line temperatures daily, especially on sun-exposed pipes.',
            'Limit transfers in very hot weather for light hydrocarbons.',
          ],
        };
      case 'underfilled_tank':
        return {
          title: 'Too much empty space in the tank',
          hazard:
            'A half-empty tank can fill with air and fuel vapor. Any spark can cause an internal explosion.',
          engineeringControls: [
            'Monitor oxygen levels in the tank vapor space with alarms.',
            'Keep nitrogen blanketing on the tank at all times.',
            'Use flame arrestors on vents and breathing lines.',
          ],
          procedures: [
            'Do not pump out below minimum safe liquid level.',
            'Test blanketing systems weekly.',
            'Ground and bond all equipment during transfers.',
          ],
        };
      case 'vacuum_collapse':
        return {
          title: 'Tank collapses from vacuum',
          hazard:
            'Pumping out too fast without enough nitrogen can crush the tank. The collapse releases fuel suddenly.',
          engineeringControls: [
            'Install vacuum relief valves sized for max pump rate.',
            'Use pressure/vacuum vents with low setpoints.',
            'Interlock pumps to stop if vacuum exceeds limits.',
          ],
          procedures: [
            'Never exceed approved pump-out rates.',
            'Verify nitrogen supply before unloading.',
            'Train operators on vacuum collapse signs.',
          ],
        };
      case 'rapid_fill_static':
        return {
          title: 'Static spark in empty tank',
          hazard:
            'Filling an empty tank quickly creates static electricity. In a flammable vapor space, a spark can ignite it.',
          engineeringControls: [
            'Use bottom-fill connections to reduce splashing.',
            'Install inert gas padding before fill operations.',
            'Ensure grounding and bonding of all metal parts.',
          ],
          procedures: [
            'Wait 30 minutes after fill before opening for sampling.',
            'Restrict fill velocity in large empty tanks.',
            'No hot work near tanks during transfer.',
          ],
        };
      case 'pressurized_sphere_bleve':
        return {
          title: 'Fire causes tank to explode (BLEVE)',
          hazard:
            'A pressurized sphere heated by fire can rupture. Liquid flashes to vapor and ignites as a huge fireball.',
          engineeringControls: [
            'Install deluge cooling on spheres and relief systems.',
            'Keep minimum safe distances between vessels.',
            'Use remote emergency shutdown and depressuring.',
          ],
          procedures: [
            'Cool exposed vessels with water if safe to approach.',
            'Evacuate to beyond calculated thermal zones.',
            'Do not fight BLEVE fire at the vessel — focus on cooling neighbors.',
          ],
        };
      default:
        return {
          title: 'General hydrocarbon release',
          hazard: 'A fuel release can form a vapor cloud that ignites and causes blast or fire.',
          engineeringControls: [
            'Maintain gas detection and automatic isolation.',
            'Provide firewater and fixed monitors.',
            'Design for containment and drainage.',
          ],
          procedures: [
            'Follow site emergency response plan.',
            'Account for all personnel in affected zones.',
            'Coordinate with local fire and medical services.',
          ],
        };
    }
  };

  const advice = getAdvisories();

  return (
    <div className="ca-panel space-y-5">
      <div>
        <p className="ca-section-label">Safety notes</p>
        <h3 className="ca-section-title" style={{ fontSize: '1.1rem' }}>
          What to do for this scenario
        </h3>
        <InfoBox>
          Plain guidance based on the scenario you selected. Use with your site&apos;s official procedures.
        </InfoBox>
      </div>

      <div className="space-y-4">
        <div className="ca-panel" style={{ padding: '1rem' }}>
          <p className="ca-section-label">The risk</p>
          <p className="ca-list-title">{advice.title}</p>
          <p className="ca-list-desc">{advice.hazard}</p>
        </div>

        <div className="ca-panel" style={{ padding: '1rem' }}>
          <p className="ca-section-label">Equipment fixes</p>
          <ul className="ca-simple-list">
            {advice.engineeringControls.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="ca-panel" style={{ padding: '1rem' }}>
          <p className="ca-section-label">Operator actions</p>
          <ul className="ca-simple-list">
            {advice.procedures.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Advisories;
