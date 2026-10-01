import React, { useMemo, useState } from 'react';
import type { IndianRegion } from '../types/physics';
import { INDIAN_REGIONS } from '../constants/regions';

interface RegionSelectorProps {
  selectedRegion: IndianRegion;
  onSelect: (region: IndianRegion) => void;
}

const ALL_STATES = [...new Set(INDIAN_REGIONS.map((r) => r.state))];

export const RegionSelector: React.FC<RegionSelectorProps> = ({ selectedRegion, onSelect }) => {
  const [query, setQuery] = useState('');
  const [stateFilter, setStateFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return INDIAN_REGIONS.filter((r) => {
      const matchesState = !stateFilter || r.state === stateFilter;
      const matchesQuery =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.state.toLowerCase().includes(q) ||
        r.facility.toLowerCase().includes(q) ||
        r.operator.toLowerCase().includes(q);
      return matchesState && matchesQuery;
    });
  }, [query, stateFilter]);

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search facility, state, operator…"
        className="ca-region-search"
      />

      <div className="ca-chips">
        <button
          type="button"
          className={`ca-chip-btn ${!stateFilter ? 'ca-chip-btn-active' : ''}`}
          onClick={() => setStateFilter(null)}
        >
          All
        </button>
        {ALL_STATES.map((state) => (
          <button
            key={state}
            type="button"
            className={`ca-chip-btn ${stateFilter === state ? 'ca-chip-btn-active' : ''}`}
            onClick={() => setStateFilter(stateFilter === state ? null : state)}
          >
            {state}
          </button>
        ))}
      </div>

      <div className="ca-facility-grid">
        {filtered.length === 0 ? (
          <p style={{ gridColumn: '1 / -1', padding: '1.5rem', textAlign: 'center', color: 'var(--ca-fg-muted)', fontSize: '0.85rem' }}>
            No facilities match.
          </p>
        ) : (
          filtered.map((region, idx) => {
            const isActive = region.id === selectedRegion.id;
            return (
              <button
                key={region.id}
                type="button"
                onClick={() => onSelect(region)}
                className={`ca-facility-card ${isActive ? 'ca-facility-card-active' : ''}`}
              >
                <span className="ca-facility-num">
                  {String(idx + 1).padStart(3, '0')} / {region.state}
                </span>
                <span className="ca-facility-name">{region.name}</span>
                <span className="ca-facility-meta">{region.facility}</span>
                <span className="ca-facility-meta">{region.operator} · {region.type}</span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
