import React from 'react';
import { X, Play } from 'lucide-react';
import type { ShowcaseProject } from './PinnedProjectShowcase';

interface ProjectDetailModalProps {
  project: ShowcaseProject | null;
  onClose: () => void;
  onLaunch: (project: ShowcaseProject) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onLaunch,
}) => {
  if (!project) return null;

  return (
    <div className="dh-modalOverlay active" onClick={onClose} role="dialog" aria-modal="true">
      <div className="dh-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          className="dh-modal__closeBtn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Column: Visual Media */}
        <div className="dh-modal__imageCol">
          <img src={project.image} alt={project.title} className="dh-modal__image" />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '1.5rem',
              background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.85) 100%)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--accent-amber)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                display: 'block',
              }}
            >
              {project.badge}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-editorial)',
                fontSize: '1.4rem',
                fontWeight: 600,
                color: '#ffffff',
              }}
            >
              {project.facility}
            </span>
          </div>
        </div>

        {/* Right Column: Consequence Breakdown */}
        <div className="dh-modal__infoCol">
          <div className="dh-modal__headerTag">
            {project.num} / PHYSICS DOSSIER · {project.type}
          </div>

          <h3 className="dh-modal__title">{project.title}</h3>
          <p className="dh-modal__text">{project.description}</p>

          <div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                letterSpacing: '0.14em',
                color: 'var(--mid)',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '0.5rem',
              }}
            >
              Key Consequence Telemetry
            </span>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.8rem',
              }}
            >
              {project.telemetry.map((t, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border-dim)',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '4px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      color: 'var(--mid)',
                      textTransform: 'uppercase',
                      display: 'block',
                    }}
                  >
                    {t.label}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      color: '#ffffff',
                    }}
                  >
                    {t.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                letterSpacing: '0.14em',
                color: 'var(--mid)',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '0.5rem',
              }}
            >
              Distance Decay & Impact Criteria
            </span>
            <table className="dh-modal__table">
              <thead>
                <tr>
                  <th>Hazard Contour</th>
                  <th>Safe Radius</th>
                  <th>Impact Classification</th>
                </tr>
              </thead>
              <tbody>
                {project.thresholds.map((row, idx) => (
                  <tr key={idx}>
                    <td style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>{row.level}</td>
                    <td>{row.distance}</td>
                    <td style={{ color: 'var(--mid-light)' }}>{row.impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
            <button
              type="button"
              className="dh-btn-pill"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => onLaunch(project)}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Configure & Simulate In Live Engine
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
