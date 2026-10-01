import React from 'react';

export type ExplosionModel = 'VCE' | 'BLEVE';

interface ModelToggleProps {
  value: ExplosionModel;
  onChange: (model: ExplosionModel) => void;
}

export const ModelToggle: React.FC<ModelToggleProps> = ({ value, onChange }) => (
  <div className="ids-segment" role="group" aria-label="Explosion model">
    <button
      type="button"
      className={`ids-segment-btn ${value === 'VCE' ? 'ids-segment-btn-active' : ''}`}
      onClick={() => onChange('VCE')}
    >
      VCE
    </button>
    <button
      type="button"
      className={`ids-segment-btn ${value === 'BLEVE' ? 'ids-segment-btn-active' : ''}`}
      onClick={() => onChange('BLEVE')}
    >
      BLEVE
    </button>
  </div>
);
