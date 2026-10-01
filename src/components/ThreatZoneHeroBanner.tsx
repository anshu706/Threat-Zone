import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, Play, ShieldAlert, Cpu } from 'lucide-react';
import type { IndianRegion, ScenarioPreset, SimulationResult } from '../types/physics';

interface ThreatZoneHeroBannerProps {
  selectedRegion: IndianRegion;
  selectedScenario: ScenarioPreset;
  result: SimulationResult;
  onRunSimulator: () => void;
  onExploreScenarios: () => void;
  onLaunchDashboard?: () => void;
}

export const ThreatZoneHeroBanner: React.FC<ThreatZoneHeroBannerProps> = ({
  selectedRegion,
  onRunSimulator,
  onExploreScenarios,
  onLaunchDashboard,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1440,
    height: typeof window !== 'undefined' ? window.innerHeight : 900,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 60FPS Dynamic Blast Wave & Shockwave Particle Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // Shockwave rings
    const rings: { radius: number; speed: number; opacity: number; color: string; maxRadius: number }[] = [];
    const maxR = Math.max(width, height) * 0.75;

    // Glowing spark particles
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      decay: number;
      hue: number;
    }[] = [];

    let frameCount = 0;

    const render = () => {
      frameCount++;

      // Semi-transparent fade for kinetic motion blur
      ctx.fillStyle = 'rgba(4, 4, 4, 0.2)';
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height * 0.42;

      // Spawn shockwaves periodically
      if (frameCount % 45 === 0) {
        rings.push({
          radius: 10,
          speed: 4.5 + Math.random() * 2,
          opacity: 0.9,
          color: frameCount % 90 === 0 ? '245, 158, 11' : '239, 68, 68',
          maxRadius: maxR,
        });
      }

      // Draw shockwave rings
      for (let i = rings.length - 1; i >= 0; i--) {
        const ring = rings[i];
        ring.radius += ring.speed;
        ring.opacity = Math.max(0, 1 - ring.radius / ring.maxRadius);

        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, ring.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${ring.color}, ${ring.opacity * 0.7})`;
        ctx.lineWidth = 2.5 + (1 - ring.radius / ring.maxRadius) * 4;
        ctx.shadowColor = `rgba(${ring.color}, 0.8)`;
        ctx.shadowBlur = 20;
        ctx.stroke();
        ctx.restore();

        if (ring.radius >= ring.maxRadius || ring.opacity <= 0.01) {
          rings.splice(i, 1);
        }
      }

      // Spawn burning particles from epicenter
      if (particles.length < 90) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 5.5;
        particles.push({
          x: centerX + (Math.random() - 0.5) * 40,
          y: centerY + (Math.random() - 0.5) * 40,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 1.5 + Math.random() * 3.5,
          alpha: 0.9,
          decay: 0.008 + Math.random() * 0.015,
          hue: 20 + Math.random() * 30, // Orange-red fiery embers
        });
      }

      // Update & render particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 95%, 60%, ${Math.max(0, p.alpha)})`;
        ctx.shadowColor = `hsla(${p.hue}, 100%, 50%, 0.8)`;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();

        if (p.alpha <= 0.01) {
          particles.splice(i, 1);
        }
      }

      // Dynamic radar sweep line
      const sweepAngle = (frameCount * 0.018) % (Math.PI * 2);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + Math.cos(sweepAngle) * maxR, centerY + Math.sin(sweepAngle) * maxR);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Target width constraint: ~74% on desktop, ~84% on mobile, max 1160px
  const targetWidth = Math.min(
    dimensions.width * (dimensions.width < 640 ? 0.84 : dimensions.width < 1024 ? 0.78 : 0.72),
    1160
  );

  // Proportional font sizing ensuring both "THREAT" and "ZONE" with their gap fit completely
  const fontSize = Math.min(
    Math.max(targetWidth / 8.8, 30),
    dimensions.height * 0.18,
    115
  );

  // Intentional, distinct space between "THREAT" and "ZONE"
  const wordGap = Math.max(fontSize * 0.46, 20);

  const textX = dimensions.width / 2;
  const textY = dimensions.height * 0.42;

  return (
    <section className="dh-banner" id="home">
      {/* Background Kinetic Canvas */}
      <canvas ref={canvasRef} className="dh-banner__canvas" />

      {/* SVG Cutout Mask Overlay (DreamHouse Signature) */}
      <svg
        className="dh-banner__overlay-svg"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <mask
            id="threatzone-hole-mask"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width={dimensions.width}
            height={dimensions.height}
          >
            {/* White reveals the solid black overlay */}
            <rect x="0" y="0" width={dimensions.width} height={dimensions.height} fill="#ffffff" />
            {/* Black cuts a hole through which the background video/canvas shines! */}
            <text
              x={textX}
              y={textY}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#000000"
              fontFamily="Syne, 'Plus Jakarta Sans', sans-serif"
              fontWeight="800"
              fontSize={fontSize}
              letterSpacing="0.03em"
            >
              <tspan>THREAT</tspan>
              <tspan dx={wordGap}>ZONE</tspan>
            </text>
          </mask>
        </defs>

        {/* The black rect with the cutout hole */}
        <rect
          x="0"
          y="0"
          width={dimensions.width}
          height={dimensions.height}
          fill="#000000"
          mask="url(#threatzone-hole-mask)"
        />

        {/* Subtle architectural border stroke around wordmark letters */}
        <text
          x={textX}
          y={textY}
          textAnchor="middle"
          dominantBaseline="central"
          fill="none"
          stroke="rgba(255, 255, 255, 0.32)"
          strokeWidth="1.2"
          fontFamily="Syne, 'Plus Jakarta Sans', sans-serif"
          fontWeight="800"
          fontSize={fontSize}
          letterSpacing="0.03em"
        >
          <tspan>THREAT</tspan>
          <tspan dx={wordGap}>ZONE</tspan>
        </text>
      </svg>

      {/* Hero Bottom Telemetry & Navigation */}
      <div className="dh-banner__content">
        <div className="dh-banner__telemetry">
          <div className="dh-banner__meta-tag">
            <span>{selectedRegion.name}</span> · <span>{selectedRegion.state}, INDIA</span> ·{' '}
            <span>
              {selectedRegion.lat.toFixed(2)}°N {selectedRegion.lng.toFixed(2)}°E
            </span>
          </div>
          <p className="dh-banner__title-sub">
            Autonomous blast physics, consequence modeling, and live consequence radar for Indian refineries and hazardous petrochemical complexes.
          </p>
        </div>

        <div className="dh-banner__actions">
          <button type="button" className="dh-btn-pill" onClick={onRunSimulator}>
            <Play className="w-3.5 h-3.5 fill-current" />
            Launch Simulator
          </button>
          <button type="button" className="dh-btn-pill-ghost" onClick={onExploreScenarios}>
            <ShieldAlert className="w-3.5 h-3.5" />
            Explore Scenarios
          </button>
          {onLaunchDashboard && (
            <button type="button" className="dh-btn-pill-ghost" onClick={onLaunchDashboard}>
              <Cpu className="w-3.5 h-3.5" />
              Full Dashboard
            </button>
          )}
        </div>
      </div>

      {/* Floating Scroll Indicator */}
      <div className="dh-banner__scroll-indicator" onClick={onExploreScenarios}>
        <span>SCROLL DOWN</span>
        <ArrowDown className="w-3 h-3" />
      </div>
    </section>
  );
};

export default ThreatZoneHeroBanner;
