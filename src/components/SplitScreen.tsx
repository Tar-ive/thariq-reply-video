import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';

interface FallingObject {
  id: string;
  x: number;
  startFrame: number;
  color: string;
  size: number;
}

interface SplitScreenProps {
  objects?: FallingObject[];
  dividerPosition?: number;
}

const defaultObjects: FallingObject[] = [
  { id: 'sphere1', x: 200, startFrame: 0, color: '#ff6b6b', size: 40 },
  { id: 'cube1', x: 350, startFrame: 30, color: '#4ecdc4', size: 35 },
  { id: 'sphere2', x: 500, startFrame: 60, color: '#45b7d1', size: 45 },
  { id: 'triangle1', x: 650, startFrame: 90, color: '#96ceb4', size: 38 },
  { id: 'sphere3', x: 800, startFrame: 120, color: '#feca57', size: 42 },
];

export const SplitScreen: React.FC<SplitScreenProps> = ({
  objects = defaultObjects,
  dividerPosition = 0.5,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Animated divider position
  const animatedDividerPos = interpolate(
    frame,
    [0, 60],
    [width * 0.3, width * dividerPosition],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Divider glow effect
  const dividerGlow = spring({
    fps,
    frame: frame - 30,
    config: {
      damping: 100,
      stiffness: 50,
    },
  });

  const renderObject = (obj: FallingObject, isReverse: boolean, panelX: number) => {
    const objectFrame = Math.max(0, frame - obj.startFrame);
    const gravity = 0.5;
    const initialVelocity = 2;

    // Calculate position with realistic physics
    const fallDistance = initialVelocity * objectFrame + 0.5 * gravity * objectFrame * objectFrame;

    const yPosition = isReverse
      ? height - 100 - fallDistance // Falling up (reverse gravity)
      : 100 + fallDistance; // Falling down (normal gravity)

    // Bounce effect when hitting boundaries
    const bounceY = isReverse
      ? Math.max(50, yPosition)
      : Math.min(height - 50, yPosition);

    // Object rotation based on fall
    const rotation = interpolate(
      objectFrame,
      [0, 120],
      [0, 720],
      {
        extrapolateRight: 'extend',
      }
    );

    // Scale effect during fall
    const scale = interpolate(
      objectFrame % 60,
      [0, 30, 60],
      [1, 1.1, 1],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }
    );

    // Object visibility based on panel boundaries
    const objectX = panelX + obj.x;
    const isVisible = isReverse
      ? objectX > animatedDividerPos + 20
      : objectX < animatedDividerPos - 20;

    if (!isVisible || objectFrame <= 0) return null;

    return (
      <div
        key={`${obj.id}-${isReverse ? 'reverse' : 'normal'}`}
        style={{
          position: 'absolute',
          left: objectX,
          top: bounceY,
          width: obj.size,
          height: obj.size,
          backgroundColor: obj.color,
          borderRadius: obj.id.includes('sphere') ? '50%' : obj.id.includes('triangle') ? '0' : '8px',
          transform: `rotate(${rotation}deg) scale(${scale})`,
          boxShadow: `0 0 20px ${obj.color}40, inset 0 0 20px rgba(255,255,255,0.3)`,
          border: '2px solid rgba(255,255,255,0.2)',
          clipPath: obj.id.includes('triangle')
            ? 'polygon(50% 0%, 0% 100%, 100% 100%)'
            : undefined,
          zIndex: 10,
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
        }}
      />
    );
  };

  return (
    <AbsoluteFill>
      {/* Background gradient */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        }}
      />

      {/* Left Panel - Normal Gravity */}
      <AbsoluteFill
        style={{
          width: animatedDividerPos,
          background: 'linear-gradient(180deg, #e3f2fd 0%, #bbdefb 100%)',
          borderRight: '1px solid rgba(255,255,255,0.3)',
          overflow: 'hidden',
        }}
      >
        {/* Panel Title */}
        <div
          style={{
            position: 'absolute',
            top: 30,
            left: 50,
            color: '#1565c0',
            fontSize: 32,
            fontWeight: 'bold',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          Normal Gravity ↓
        </div>

        {/* Gravity field visualization */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `linear-gradient(0deg,
              rgba(21,101,192,0.1) 0%,
              transparent 30%,
              transparent 70%,
              rgba(21,101,192,0.05) 100%)`,
            pointerEvents: 'none',
          }}
        />

        {/* Falling objects */}
        {objects.map((obj) => renderObject(obj, false, 0))}
      </AbsoluteFill>

      {/* Right Panel - Reverse Gravity */}
      <AbsoluteFill
        style={{
          left: animatedDividerPos,
          width: width - animatedDividerPos,
          background: 'linear-gradient(0deg, #e8f5e8 0%, #c8e6c9 100%)',
          borderLeft: '1px solid rgba(255,255,255,0.3)',
          overflow: 'hidden',
        }}
      >
        {/* Panel Title */}
        <div
          style={{
            position: 'absolute',
            top: 30,
            left: 50,
            color: '#2e7d32',
            fontSize: 32,
            fontWeight: 'bold',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          Reverse Gravity ↑
        </div>

        {/* Reverse gravity field visualization */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `linear-gradient(180deg,
              rgba(46,125,50,0.1) 0%,
              transparent 30%,
              transparent 70%,
              rgba(46,125,50,0.05) 100%)`,
            pointerEvents: 'none',
          }}
        />

        {/* Falling objects (upward) */}
        {objects.map((obj) => renderObject(obj, true, -animatedDividerPos))}
      </AbsoluteFill>

      {/* Animated Divider */}
      <div
        style={{
          position: 'absolute',
          left: animatedDividerPos - 2,
          top: 0,
          width: 4,
          height: '100%',
          background: `linear-gradient(0deg,
            rgba(255,255,255,0.8) 0%,
            rgba(255,255,255,${0.9 + dividerGlow * 0.1}) 50%,
            rgba(255,255,255,0.8) 100%)`,
          boxShadow: `0 0 ${20 + dividerGlow * 10}px rgba(255,255,255,0.6)`,
          zIndex: 100,
        }}
      />

      {/* Particles along divider */}
      {Array.from({ length: 8 }).map((_, i) => {
        const particleY = interpolate(
          (frame + i * 15) % 120,
          [0, 120],
          [-20, height + 20],
          {
            extrapolateRight: 'extend',
          }
        );

        return (
          <div
            key={`particle-${i}`}
            style={{
              position: 'absolute',
              left: animatedDividerPos - 8,
              top: particleY,
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
              filter: 'blur(1px)',
              zIndex: 99,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};