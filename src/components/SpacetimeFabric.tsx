import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';

interface MassObject {
  x: number;
  y: number;
  mass: number;
  color: string;
  id: string;
}

interface SpacetimeFabricProps {
  masses?: MassObject[];
  gridSize?: number;
  showObjectPaths?: boolean;
  etherealGlow?: boolean;
}

const defaultMasses: MassObject[] = [
  { x: 400, y: 300, mass: 100, color: '#ff6b6b', id: 'star' },
  { x: 700, y: 500, mass: 50, color: '#4ecdc4', id: 'planet' },
  { x: 200, y: 700, mass: 30, color: '#45b7d1', id: 'moon' },
];

export const SpacetimeFabric: React.FC<SpacetimeFabricProps> = ({
  masses = defaultMasses,
  gridSize = 40,
  showObjectPaths = true,
  etherealGlow = true,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Calculate spacetime curvature at a point
  const calculateCurvature = (x: number, y: number): number => {
    let totalCurvature = 0;

    masses.forEach((mass) => {
      const distance = Math.sqrt((x - mass.x) ** 2 + (y - mass.y) ** 2);
      const curvature = mass.mass / Math.max(distance * distance, 1000);
      totalCurvature += curvature;
    });

    return Math.min(totalCurvature, 50); // Cap maximum curvature
  };

  // Generate curved grid points
  const generateGridPoints = () => {
    const points: Array<{ x: number; y: number; curvature: number }> = [];

    for (let x = 0; x <= width; x += gridSize) {
      for (let y = 0; y <= height; y += gridSize) {
        const curvature = calculateCurvature(x, y);
        points.push({ x, y, curvature });
      }
    }

    return points;
  };

  // Calculate orbital path for objects
  const calculateOrbitalPosition = (
    centerMass: MassObject,
    orbitRadius: number,
    speed: number,
    offset: number = 0
  ) => {
    const angle = (frame * speed + offset) * (Math.PI / 180);
    const x = centerMass.x + orbitRadius * Math.cos(angle);
    const y = centerMass.y + orbitRadius * Math.sin(angle);
    return { x, y, angle };
  };

  // Generate SVG grid lines with curvature
  const renderSpacetimeGrid = () => {
    const gridPaths: string[] = [];

    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      let path = `M 0 ${y}`;
      for (let x = gridSize; x <= width; x += gridSize) {
        const curvature = calculateCurvature(x, y);
        const curvedY = y + curvature * Math.sin((x / width) * Math.PI * 2);
        path += ` L ${x} ${curvedY}`;
      }
      gridPaths.push(path);
    }

    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      let path = `M ${x} 0`;
      for (let y = gridSize; y <= height; y += gridSize) {
        const curvature = calculateCurvature(x, y);
        const curvedX = x + curvature * Math.sin((y / height) * Math.PI * 2);
        path += ` L ${curvedX} ${y}`;
      }
      gridPaths.push(path);
    }

    return gridPaths;
  };

  // Animated grid opacity
  const gridOpacity = interpolate(
    frame,
    [0, 60, 120],
    [0, 0.6, 0.4],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Orbital calculations
  const planet1 = calculateOrbitalPosition(masses[0], 150, 2, 0);
  const planet2 = calculateOrbitalPosition(masses[0], 220, 1.5, 120);
  const moon1 = calculateOrbitalPosition(masses[1], 80, 4, 45);

  return (
    <AbsoluteFill>
      {/* Deep space background */}
      <AbsoluteFill
        style={{
          background: `
            radial-gradient(ellipse at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 40% 40%, rgba(120, 219, 226, 0.2) 0%, transparent 50%),
            linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)
          `,
        }}
      />

      {/* Spacetime fabric grid */}
      <svg
        width={width}
        height={height}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          opacity: gridOpacity,
        }}
      >
        <defs>
          <filter id="gridGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#64b5f6', stopOpacity: 0.8 }} />
            <stop offset="50%" style={{ stopColor: '#ffffff', stopOpacity: 0.6 }} />
            <stop offset="100%" style={{ stopColor: '#81c784', stopOpacity: 0.8 }} />
          </linearGradient>
        </defs>

        {renderSpacetimeGrid().map((path, index) => (
          <path
            key={index}
            d={path}
            stroke="url(#gridGradient)"
            strokeWidth={index % 2 === 0 ? "1.5" : "1"}
            fill="none"
            filter={etherealGlow ? "url(#gridGlow)" : undefined}
            opacity={interpolate(
              Math.sin((frame + index * 10) * 0.1),
              [-1, 1],
              [0.4, 0.8],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            )}
          />
        ))}
      </svg>

      {/* Gravitational wells visualization */}
      {masses.map((mass, index) => {
        const wellSize = interpolate(
          spring({
            fps,
            frame: frame - index * 20,
            config: { damping: 200, stiffness: 50 },
          }),
          [0, 1],
          [0, mass.mass * 3],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        return (
          <div
            key={`well-${mass.id}`}
            style={{
              position: 'absolute',
              left: mass.x - wellSize,
              top: mass.y - wellSize,
              width: wellSize * 2,
              height: wellSize * 2,
              borderRadius: '50%',
              background: `radial-gradient(circle,
                ${mass.color}20 0%,
                ${mass.color}10 30%,
                transparent 70%)`,
              border: `2px solid ${mass.color}40`,
              filter: 'blur(2px)',
              zIndex: 1,
            }}
          />
        );
      })}

      {/* Main mass objects */}
      {masses.map((mass, index) => {
        const pulseScale = interpolate(
          Math.sin((frame + index * 30) * 0.2),
          [-1, 1],
          [0.9, 1.1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        return (
          <div
            key={`mass-${mass.id}`}
            style={{
              position: 'absolute',
              left: mass.x - mass.mass / 2,
              top: mass.y - mass.mass / 2,
              width: mass.mass,
              height: mass.mass,
              borderRadius: '50%',
              background: `radial-gradient(circle,
                ${mass.color} 0%,
                ${mass.color}dd 40%,
                ${mass.color}aa 100%)`,
              boxShadow: `
                0 0 20px ${mass.color}80,
                0 0 40px ${mass.color}40,
                inset 0 0 20px rgba(255,255,255,0.3)
              `,
              transform: `scale(${pulseScale})`,
              border: '2px solid rgba(255,255,255,0.3)',
              zIndex: 10,
            }}
          />
        );
      })}

      {/* Orbiting objects */}
      <div
        style={{
          position: 'absolute',
          left: planet1.x - 15,
          top: planet1.y - 15,
          width: 30,
          height: 30,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #feca57 0%, #ff9ff3 100%)',
          boxShadow: '0 0 15px #feca5780',
          zIndex: 8,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: planet2.x - 20,
          top: planet2.y - 20,
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #54a0ff 0%, #5f27cd 100%)',
          boxShadow: '0 0 20px #54a0ff80',
          zIndex: 8,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: moon1.x - 8,
          top: moon1.y - 8,
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #c7ecee 0%, #686de0 100%)',
          boxShadow: '0 0 10px #c7ecee80',
          zIndex: 8,
        }}
      />

      {/* Orbital paths */}
      {showObjectPaths && (
        <svg
          width={width}
          height={height}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 5,
          }}
        >
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.3 }} />
              <stop offset="50%" style={{ stopColor: '#64b5f6', stopOpacity: 0.5 }} />
              <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 0.3 }} />
            </linearGradient>
          </defs>

          {/* Planet 1 orbit */}
          <circle
            cx={masses[0].x}
            cy={masses[0].y}
            r={150}
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth="1"
            strokeDasharray="10,5"
            opacity={0.6}
          />

          {/* Planet 2 orbit */}
          <circle
            cx={masses[0].x}
            cy={masses[0].y}
            r={220}
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth="1"
            strokeDasharray="15,8"
            opacity={0.4}
          />

          {/* Moon orbit */}
          <circle
            cx={masses[1].x}
            cy={masses[1].y}
            r={80}
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth="1"
            strokeDasharray="5,3"
            opacity={0.5}
          />
        </svg>
      )}

      {/* Ethereal particle effects */}
      {etherealGlow && Array.from({ length: 15 }).map((_, i) => {
        const particleX = interpolate(
          (frame + i * 20) % 180,
          [0, 180],
          [0, width],
          { extrapolateRight: 'extend' }
        );

        const particleY = interpolate(
          Math.sin((frame + i * 15) * 0.05),
          [-1, 1],
          [height * 0.2, height * 0.8],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        const particleOpacity = interpolate(
          Math.sin((frame + i * 10) * 0.1),
          [-1, 1],
          [0.2, 0.8],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        return (
          <div
            key={`particle-${i}`}
            style={{
              position: 'absolute',
              left: particleX,
              top: particleY,
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
              filter: 'blur(1px)',
              opacity: particleOpacity,
              zIndex: 2,
            }}
          />
        );
      })}

      {/* Curvature intensity indicators */}
      {masses.map((mass, index) => (
        <div
          key={`intensity-${mass.id}`}
          style={{
            position: 'absolute',
            left: mass.x - mass.mass * 1.5,
            top: mass.y - mass.mass * 1.5,
            width: mass.mass * 3,
            height: mass.mass * 3,
            borderRadius: '50%',
            border: `2px solid ${mass.color}30`,
            background: 'transparent',
            animation: `pulse ${2 + index * 0.5}s infinite`,
            zIndex: 1,
          }}
        />
      ))}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 0.1; }
        }
      `}</style>
    </AbsoluteFill>
  );
};