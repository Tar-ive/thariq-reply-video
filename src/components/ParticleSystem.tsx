import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  random,
} from 'remotion';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  type: 'spark' | 'glow' | 'energy' | 'quantum';
}

interface ParticleSystemProps {
  particleCount?: number;
  emissionRate?: number;
  colors?: string[];
  gravity?: number;
  turbulence?: number;
  glowIntensity?: number;
  quantumEffects?: boolean;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  particleCount = 100,
  emissionRate = 3,
  colors = ['#64b5f6', '#81c784', '#ffb74d', '#f06292', '#ba68c8'],
  gravity = 0.02,
  turbulence = 0.05,
  glowIntensity = 1,
  quantumEffects = true,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Generate particles with deterministic randomness
  const generateParticles = (): Particle[] => {
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const birthFrame = Math.floor(i / emissionRate);
      const age = frame - birthFrame;

      if (age < 0) continue;

      const baseX = random(`px-${i}`) * width;
      const baseY = random(`py-${i}`) * height;

      // Initial velocity with some randomness
      const vx = (random(`vx-${i}`) - 0.5) * 4;
      const vy = (random(`vy-${i}`) - 0.5) * 4;

      const maxLife = 120 + random(`life-${i}`) * 120; // 4-8 seconds at 30fps
      const size = 2 + random(`size-${i}`) * 6;
      const colorIndex = Math.floor(random(`color-${i}`) * colors.length);
      const type = (['spark', 'glow', 'energy', 'quantum'] as const)[
        Math.floor(random(`type-${i}`) * 4)
      ];

      if (age > maxLife) continue;

      // Physics simulation
      const turbulenceX = Math.sin((frame + i) * 0.05) * turbulence;
      const turbulenceY = Math.cos((frame + i) * 0.03) * turbulence;

      const x = baseX + (vx + turbulenceX) * age;
      const y = baseY + (vy + turbulenceY) * age + gravity * age * age * 0.5;

      particles.push({
        id: i,
        x,
        y,
        vx: vx + turbulenceX,
        vy: vy + turbulenceY + gravity * age,
        size,
        color: colors[colorIndex],
        life: age,
        maxLife,
        type,
      });
    }

    return particles;
  };

  const particles = generateParticles();

  // Render different particle types
  const renderParticle = (particle: Particle) => {
    const lifeRatio = particle.life / particle.maxLife;
    const opacity = interpolate(
      lifeRatio,
      [0, 0.1, 0.8, 1],
      [0, 1, 1, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    const scale = interpolate(
      lifeRatio,
      [0, 0.2, 1],
      [0.5, 1.2, 0.8],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    // Check if particle is within bounds
    if (
      particle.x < -50 ||
      particle.x > width + 50 ||
      particle.y < -50 ||
      particle.y > height + 50 ||
      opacity <= 0
    ) {
      return null;
    }

    const baseStyle = {
      position: 'absolute' as const,
      left: particle.x - particle.size / 2,
      top: particle.y - particle.size / 2,
      width: particle.size,
      height: particle.size,
      opacity,
      transform: `scale(${scale})`,
      pointerEvents: 'none' as const,
    };

    switch (particle.type) {
      case 'spark':
        return (
          <div
            key={`spark-${particle.id}`}
            style={{
              ...baseStyle,
              background: `radial-gradient(circle, ${particle.color} 0%, ${particle.color}80 40%, transparent 100%)`,
              borderRadius: '50%',
              filter: `blur(${0.5 + lifeRatio}px) brightness(${1 + glowIntensity * 0.5})`,
              boxShadow: `0 0 ${particle.size * 2 * glowIntensity}px ${particle.color}80`,
            }}
          />
        );

      case 'glow':
        return (
          <div
            key={`glow-${particle.id}`}
            style={{
              ...baseStyle,
              background: `radial-gradient(circle, ${particle.color}40 0%, ${particle.color}20 50%, transparent 100%)`,
              borderRadius: '50%',
              filter: `blur(${2 + lifeRatio * 2}px)`,
              width: particle.size * 2,
              height: particle.size * 2,
              left: particle.x - particle.size,
              top: particle.y - particle.size,
            }}
          />
        );

      case 'energy':
        const energyRotation = (particle.life * 10) % 360;
        return (
          <div
            key={`energy-${particle.id}`}
            style={{
              ...baseStyle,
              background: `linear-gradient(45deg, ${particle.color} 0%, transparent 50%, ${particle.color} 100%)`,
              borderRadius: '50%',
              transform: `scale(${scale}) rotate(${energyRotation}deg)`,
              filter: `blur(1px) brightness(${1.5})`,
              boxShadow: `0 0 ${particle.size * 3}px ${particle.color}60`,
            }}
          />
        );

      case 'quantum':
        if (!quantumEffects) return null;

        const quantumPhase = Math.sin(particle.life * 0.2) * 0.5 + 0.5;
        const quantumColor = interpolate(
          quantumPhase,
          [0, 1],
          [0, colors.length - 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        const currentColor = colors[Math.floor(quantumColor)];

        return (
          <div
            key={`quantum-${particle.id}`}
            style={{
              ...baseStyle,
              background: `radial-gradient(circle, ${currentColor} 0%, ${currentColor}40 30%, transparent 70%)`,
              borderRadius: '50%',
              border: `1px solid ${currentColor}60`,
              filter: `blur(${Math.sin(particle.life * 0.3)}px) hue-rotate(${particle.life * 5}deg)`,
              transform: `scale(${scale}) ${Math.sin(particle.life * 0.1) > 0 ? 'scaleX(-1)' : ''}`,
            }}
          />
        );

      default:
        return null;
    }
  };

  // Energy field background effect
  const energyFieldOpacity = interpolate(
    Math.sin(frame * 0.02),
    [-1, 1],
    [0.05, 0.15],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* Energy field background */}
      <AbsoluteFill
        style={{
          background: `
            radial-gradient(ellipse at 25% 25%, ${colors[0]}10 0%, transparent 50%),
            radial-gradient(ellipse at 75% 75%, ${colors[1]}10 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, ${colors[2]}08 0%, transparent 60%)
          `,
          opacity: energyFieldOpacity,
          filter: 'blur(20px)',
        }}
      />

      {/* Render all particles */}
      {particles.map(renderParticle)}

      {/* Energy waves */}
      {Array.from({ length: 5 }).map((_, i) => {
        const waveProgress = ((frame + i * 60) % 300) / 300;
        const waveSize = interpolate(
          waveProgress,
          [0, 1],
          [0, Math.max(width, height) * 1.5],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        const waveOpacity = interpolate(
          waveProgress,
          [0, 0.2, 0.8, 1],
          [0, 0.3, 0.1, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        const waveX = width * (0.2 + i * 0.15);
        const waveY = height * (0.3 + i * 0.1);

        return (
          <div
            key={`wave-${i}`}
            style={{
              position: 'absolute',
              left: waveX - waveSize / 2,
              top: waveY - waveSize / 2,
              width: waveSize,
              height: waveSize,
              borderRadius: '50%',
              border: `2px solid ${colors[i % colors.length]}`,
              opacity: waveOpacity * glowIntensity,
              filter: 'blur(2px)',
            }}
          />
        );
      })}

      {/* Quantum entanglement lines */}
      {quantumEffects && (
        <svg
          width={width}
          height={height}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: 0.3,
          }}
        >
          <defs>
            <linearGradient id="entanglementGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: colors[0], stopOpacity: 0.6 }} />
              <stop offset="50%" style={{ stopColor: colors[2], stopOpacity: 0.8 }} />
              <stop offset="100%" style={{ stopColor: colors[4], stopOpacity: 0.6 }} />
            </linearGradient>
          </defs>

          {particles
            .filter(p => p.type === 'quantum')
            .slice(0, 5)
            .map((particle, index) => {
              const nextParticle = particles.find(p =>
                p.type === 'quantum' && p.id > particle.id
              ) || particles.find(p => p.type === 'quantum');

              if (!nextParticle || nextParticle.id === particle.id) return null;

              return (
                <path
                  key={`entanglement-${particle.id}-${nextParticle.id}`}
                  d={`M ${particle.x} ${particle.y} Q ${
                    (particle.x + nextParticle.x) / 2
                  } ${
                    (particle.y + nextParticle.y) / 2 - 50
                  } ${nextParticle.x} ${nextParticle.y}`}
                  stroke="url(#entanglementGradient)"
                  strokeWidth="1"
                  fill="none"
                  opacity={interpolate(
                    Math.sin((frame + index * 30) * 0.1),
                    [-1, 1],
                    [0.2, 0.6],
                    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                  )}
                  filter="blur(1px)"
                />
              );
            })}
        </svg>
      )}
    </AbsoluteFill>
  );
};