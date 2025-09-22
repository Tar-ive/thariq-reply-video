import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';

interface VisualEffectsProps {
  effectType?: 'glow' | 'bloom' | 'chromatic' | 'holographic' | 'quantum';
  intensity?: number;
  colorShift?: boolean;
  morphing?: boolean;
  etherealGlow?: boolean;
  scientificAesthetic?: boolean;
}

export const VisualEffects: React.FC<VisualEffectsProps> = ({
  effectType = 'holographic',
  intensity = 1,
  colorShift = true,
  morphing = true,
  etherealGlow = true,
  scientificAesthetic = true,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Color shifting animation
  const hueRotation = interpolate(
    frame,
    [0, 300],
    [0, 360],
    { extrapolateRight: 'extend' }
  );

  // Morphing scale animation
  const morphScale = spring({
    fps,
    frame: frame % 120,
    config: {
      damping: 100,
      stiffness: 200,
    },
  });

  // Glow intensity pulsing
  const glowPulse = interpolate(
    Math.sin(frame * 0.1),
    [-1, 1],
    [0.5, 1.5],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Scientific grid overlay
  const renderScientificGrid = () => {
    if (!scientificAesthetic) return null;

    const gridOpacity = interpolate(
      frame,
      [0, 60],
      [0, 0.3],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    return (
      <svg
        width={width}
        height={height}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          opacity: gridOpacity * intensity,
          pointerEvents: 'none',
        }}
      >
        <defs>
          <pattern
            id="scientificGrid"
            x="0"
            y="0"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="rgba(100, 181, 246, 0.3)"
              strokeWidth="1"
            />
          </pattern>

          <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#64b5f6', stopOpacity: 0.4 }} />
            <stop offset="50%" style={{ stopColor: '#81c784', stopOpacity: 0.6 }} />
            <stop offset="100%" style={{ stopColor: '#ffb74d', stopOpacity: 0.4 }} />
          </linearGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#scientificGrid)" />

        {/* Scientific measurement lines */}
        {Array.from({ length: 10 }).map((_, i) => {
          const lineY = (height / 10) * i;
          const lineOpacity = interpolate(
            Math.sin((frame + i * 20) * 0.05),
            [-1, 1],
            [0.2, 0.6],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );

          return (
            <line
              key={`measurement-${i}`}
              x1="0"
              y1={lineY}
              x2={width}
              y2={lineY}
              stroke="url(#gridGradient)"
              strokeWidth="0.5"
              opacity={lineOpacity}
              strokeDasharray="10,5"
            />
          );
        })}
      </svg>
    );
  };

  // Holographic effects
  const renderHolographicEffect = () => {
    if (effectType !== 'holographic') return null;

    return (
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        {/* Holographic scanlines */}
        {Array.from({ length: 20 }).map((_, i) => {
          const scanlineY = interpolate(
            (frame + i * 15) % 200,
            [0, 200],
            [-10, height + 10],
            { extrapolateRight: 'extend' }
          );

          return (
            <div
              key={`scanline-${i}`}
              style={{
                position: 'absolute',
                top: scanlineY,
                left: 0,
                width: '100%',
                height: 2,
                background: `linear-gradient(90deg,
                  transparent 0%,
                  rgba(100, 181, 246, ${0.6 * intensity}) 50%,
                  transparent 100%)`,
                filter: 'blur(1px)',
              }}
            />
          );
        })}

        {/* Holographic interference patterns */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 2px,
                rgba(100, 181, 246, ${0.1 * intensity}) 2px,
                rgba(100, 181, 246, ${0.1 * intensity}) 4px
              )
            `,
            opacity: 0.5,
            filter: colorShift ? `hue-rotate(${hueRotation}deg)` : 'none',
          }}
        />
      </AbsoluteFill>
    );
  };

  // Quantum field effects
  const renderQuantumField = () => {
    if (effectType !== 'quantum') return null;

    return (
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        {/* Quantum fluctuations */}
        {Array.from({ length: 30 }).map((_, i) => {
          const fluctuationX = interpolate(
            Math.sin((frame + i * 25) * 0.03),
            [-1, 1],
            [0, width],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );

          const fluctuationY = interpolate(
            Math.cos((frame + i * 15) * 0.05),
            [-1, 1],
            [0, height],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );

          const fluctuationOpacity = interpolate(
            Math.sin((frame + i * 10) * 0.1),
            [-1, 1],
            [0.1, 0.8],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );

          return (
            <div
              key={`quantum-${i}`}
              style={{
                position: 'absolute',
                left: fluctuationX,
                top: fluctuationY,
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: `radial-gradient(circle,
                  rgba(255, 255, 255, ${fluctuationOpacity * intensity}) 0%,
                  transparent 70%)`,
                filter: 'blur(2px)',
              }}
            />
          );
        })}

        {/* Quantum field overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `
              radial-gradient(ellipse at 30% 70%, rgba(129, 199, 132, 0.1) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 30%, rgba(186, 104, 200, 0.1) 0%, transparent 50%)
            `,
            opacity: intensity,
            filter: colorShift ? `hue-rotate(${hueRotation * 0.5}deg)` : 'none',
          }}
        />
      </AbsoluteFill>
    );
  };

  // Chromatic aberration effect
  const renderChromaticAberration = () => {
    if (effectType !== 'chromatic') return null;

    const aberrationOffset = interpolate(
      Math.sin(frame * 0.05),
      [-1, 1],
      [0, 3 * intensity],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    return (
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `
              radial-gradient(circle at 50% 50%,
                rgba(255, 0, 0, ${0.1 * intensity}) 0%,
                transparent 70%)
            `,
            transform: `translateX(${aberrationOffset}px)`,
            mixBlendMode: 'screen',
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `
              radial-gradient(circle at 50% 50%,
                rgba(0, 255, 0, ${0.1 * intensity}) 0%,
                transparent 70%)
            `,
            mixBlendMode: 'screen',
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `
              radial-gradient(circle at 50% 50%,
                rgba(0, 0, 255, ${0.1 * intensity}) 0%,
                transparent 70%)
            `,
            transform: `translateX(-${aberrationOffset}px)`,
            mixBlendMode: 'screen',
          }}
        />
      </AbsoluteFill>
    );
  };

  // Bloom effect
  const renderBloomEffect = () => {
    if (effectType !== 'bloom') return null;

    return (
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`bloom-${i}`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: `
                radial-gradient(ellipse at center,
                  rgba(255, 255, 255, ${0.05 * intensity}) 0%,
                  transparent 60%)
              `,
              filter: `blur(${10 + i * 5}px)`,
              opacity: glowPulse * (1 - i * 0.15),
              transform: `scale(${1 + i * 0.1})`,
            }}
          />
        ))}
      </AbsoluteFill>
    );
  };

  // Morphing geometric shapes
  const renderMorphingShapes = () => {
    if (!morphing) return null;

    return (
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        {Array.from({ length: 6 }).map((_, i) => {
          const shapeX = (width / 7) * (i + 1);
          const shapeY = height / 2;
          const shapeScale = interpolate(
            (frame + i * 20) % 120,
            [0, 60, 120],
            [0.5, 1.5, 0.5],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );

          const shapeRotation = (frame + i * 45) * 2;

          return (
            <div
              key={`morph-${i}`}
              style={{
                position: 'absolute',
                left: shapeX - 25,
                top: shapeY - 25,
                width: 50,
                height: 50,
                background: `conic-gradient(
                  from ${shapeRotation}deg,
                  rgba(100, 181, 246, 0.3),
                  rgba(129, 199, 132, 0.3),
                  rgba(255, 183, 77, 0.3),
                  rgba(240, 98, 146, 0.3),
                  rgba(100, 181, 246, 0.3)
                )`,
                borderRadius: i % 2 === 0 ? '50%' : '8px',
                transform: `scale(${shapeScale * morphScale}) rotate(${shapeRotation}deg)`,
                filter: 'blur(2px)',
                opacity: 0.6 * intensity,
              }}
            />
          );
        })}
      </AbsoluteFill>
    );
  };

  // Ethereal glow overlay
  const renderEtherealGlow = () => {
    if (!etherealGlow) return null;

    return (
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `
              radial-gradient(ellipse at 20% 30%, rgba(100, 181, 246, ${0.15 * intensity}) 0%, transparent 40%),
              radial-gradient(ellipse at 80% 70%, rgba(129, 199, 132, ${0.15 * intensity}) 0%, transparent 40%),
              radial-gradient(ellipse at 50% 50%, rgba(255, 183, 77, ${0.1 * intensity}) 0%, transparent 50%)
            `,
            opacity: glowPulse,
            filter: colorShift ? `hue-rotate(${hueRotation * 0.3}deg)` : 'none',
          }}
        />

        {/* Ethereal particles */}
        {Array.from({ length: 20 }).map((_, i) => {
          const particleX = interpolate(
            (frame + i * 30) % 240,
            [0, 240],
            [-50, width + 50],
            { extrapolateRight: 'extend' }
          );

          const particleY = interpolate(
            Math.sin((frame + i * 20) * 0.02),
            [-1, 1],
            [height * 0.2, height * 0.8],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );

          return (
            <div
              key={`ethereal-${i}`}
              style={{
                position: 'absolute',
                left: particleX,
                top: particleY,
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.6)',
                filter: 'blur(1px)',
                opacity: intensity * 0.8,
              }}
            />
          );
        })}
      </AbsoluteFill>
    );
  };

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 1000 }}>
      {renderScientificGrid()}
      {renderHolographicEffect()}
      {renderQuantumField()}
      {renderChromaticAberration()}
      {renderBloomEffect()}
      {renderMorphingShapes()}
      {renderEtherealGlow()}

      {/* Global color correction overlay */}
      <AbsoluteFill
        style={{
          background: scientificAesthetic
            ? `linear-gradient(135deg,
                rgba(100, 181, 246, 0.05) 0%,
                transparent 50%,
                rgba(129, 199, 132, 0.05) 100%)`
            : 'transparent',
          filter: colorShift ? `hue-rotate(${hueRotation * 0.1}deg) saturate(${1 + intensity * 0.2})` : 'none',
          opacity: 0.8 * intensity,
        }}
      />
    </AbsoluteFill>
  );
};