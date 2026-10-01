import React from 'react';
import { Sun, Moon, RotateCcw } from 'lucide-react';
import type { IndianRegion } from '../types/physics';
import { AnimatedText } from './AnimatedText';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  selectedRegion: IndianRegion;
  onRestartTour?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  selectedRegion,
  onRestartTour,
}) => {
  return (
    <header className="ca-header">
      <div className="ca-header-row">
        <div>
          <p className="ca-eyebrow tz-eyebrow-animate">Industrial safety for India</p>
          <AnimatedText
            as="h1"
            className="ca-title tz-display-shimmer"
            text="See blast and fire danger before it happens"
            by="words"
            shimmer
          />
          <p className="ca-subtitle">
            Pick a refinery, set your scenario, and get clear numbers — blast radius, heat zones, and
            safety tips for {selectedRegion.name}.
          </p>
        </div>
        <div className="ca-header-actions">
          <span className="ca-chip">{selectedRegion.name}</span>
          <span className="ca-chip">India sites</span>
          {onRestartTour && (
            <button
              type="button"
              className="ca-btn-icon"
              onClick={onRestartTour}
              title="Restart tour"
              aria-label="Restart tour"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            className="ca-btn-icon"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
