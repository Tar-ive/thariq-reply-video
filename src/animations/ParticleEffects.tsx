import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

interface ParticleEffectsProps {
  type: 'sparks' | 'flow' | 'burst' | 'code';
  intensity?: number;
  startFrame?: number;
  color?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export const ParticleEffects: React.FC<ParticleEffectsProps> = ({
  type,
  intensity = 0.6,
  startFrame = 0,
  color = '#61dafb',
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const relativeFrame = Math.max(0, frame - startFrame);

  // Generate particles based on type
  const generateParticles = (): Particle[] => {
    const particleCount = Math.floor(intensity * 100);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const seed = i + relativeFrame * 0.1;

      switch (type) {
        case 'sparks':
          particles.push(generateSparkParticle(i, seed, width, height));
          break;
        case 'flow':
          particles.push(generateFlowParticle(i, seed, width, height));
          break;
        case 'burst':
          particles.push(generateBurstParticle(i, seed, width, height));
          break;
        case 'code':
          particles.push(generateCodeParticle(i, seed, width, height));
          break;
      }
    }

    return particles;
  };

  const generateSparkParticle = (id: number, seed: number, w: number, h: number): Particle => {
    const life = relativeFrame % 120;
    const maxLife = 120;
    const progress = life / maxLife;

    const startX = random(seed) * w;
    const startY = random(seed + 1) * h;
    const angle = random(seed + 2) * Math.PI * 2;
    const speed = 2 + random(seed + 3) * 3;

    return {
      id,
      x: startX + Math.cos(angle) * speed * life,
      y: startY + Math.sin(angle) * speed * life - (life * life * 0.02),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life,
      maxLife,
      size: 2 + random(seed + 4) * 3,
      color: `hsl(${200 + random(seed + 5) * 60}, 70%, ${50 + random(seed + 6) * 30}%)`,
    };
  };

  const generateFlowParticle = (id: number, seed: number, w: number, h: number): Particle => {
    const life = (relativeFrame + id * 3) % 200;
    const maxLife = 200;
    const progress = life / maxLife;

    const flowPath = Math.sin(progress * Math.PI) * 100;

    return {
      id,
      x: -50 + (progress * (w + 100)),
      y: h * 0.5 + flowPath + (random(seed) - 0.5) * 50,
      vx: w / maxLife,
      vy: 0,
      life,
      maxLife,
      size: 1 + random(seed + 1) * 2,
      color: `hsla(${180 + random(seed + 2) * 40}, 80%, 60%, ${1 - progress * 0.5})`,
    };
  };

  const generateBurstParticle = (id: number, seed: number, w: number, h: number): Particle => {
    const life = relativeFrame % 90;
    const maxLife = 90;
    const progress = life / maxLife;

    const centerX = w * 0.5;
    const centerY = h * 0.5;
    const angle = (id / 50) * Math.PI * 2 + relativeFrame * 0.05;
    const radius = progress * 200;

    return {
      id,
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      vx: Math.cos(angle) * 2,
      vy: Math.sin(angle) * 2,
      life,
      maxLife,
      size: 3 * (1 - progress),
      color: `hsla(${45 + random(seed) * 30}, 90%, 70%, ${1 - progress})`,
    };
  };

  const generateCodeParticle = (id: number, seed: number, w: number, h: number): Particle => {
    const codeChars = ['0', '1', '{', '}', '(', ')', ';', '=', '+', '-', '*', '/', '<', '>'];
    const life = (relativeFrame + id * 5) % 150;
    const maxLife = 150;
    const progress = life / maxLife;

    return {
      id,
      x: random(seed) * w,
      y: -20 + progress * (h + 40),
      vx: (random(seed + 1) - 0.5) * 0.5,
      vy: 2,
      life,
      maxLife,
      size: 12 + random(seed + 2) * 8,
      color: `hsla(${120 + random(seed + 3) * 120}, 70%, 60%, ${1 - progress * 0.7})`,
    };
  };

  const particles = generateParticles();

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {particles.map((particle) => {
        const opacity = interpolate(
          particle.life,
          [0, particle.maxLife * 0.3, particle.maxLife * 0.7, particle.maxLife],
          [0, 1, 1, 0],
          { extrapolateRight: 'clamp' }
        );

        if (type === 'code') {
          return (
            <div
              key={particle.id}
              style={{
                position: 'absolute',
                left: particle.x,
                top: particle.y,
                fontSize: particle.size,
                color: particle.color,
                opacity,
                fontFamily: 'JetBrains Mono, monospace',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              {['0', '1', '{', '}', '(', ')', ';', '='][particle.id % 8]}
            </div>
          );
        }

        return (
          <div
            key={particle.id}
            style={{
              position: 'absolute',
              left: particle.x - particle.size / 2,
              top: particle.y - particle.size / 2,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              borderRadius: '50%',
              opacity,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
              pointerEvents: 'none',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export default ParticleEffects;