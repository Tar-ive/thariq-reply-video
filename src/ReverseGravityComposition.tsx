import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';
import { TransitionSeries } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { wipe } from '@remotion/transitions/wipe';
import { clockWipe } from '@remotion/transitions/clock-wipe';
import { linearTiming, springTiming } from '@remotion/transitions';

import { SplitScreen } from './components/SplitScreen';
import { SpacetimeFabric } from './components/SpacetimeFabric';
import { ParticleSystem } from './components/ParticleSystem';
import { VisualEffects } from './components/VisualEffects';

export const ReverseGravityComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Title overlay component
  const TitleOverlay: React.FC<{ title: string; subtitle?: string }> = ({
    title,
    subtitle
  }) => {
    const titleOpacity = interpolate(
      frame % 120,
      [0, 30, 90, 120],
      [0, 1, 1, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    return (
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(10px)',
          opacity: titleOpacity,
          zIndex: 1000,
        }}
      >
        <h1
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            color: '#ffffff',
            textAlign: 'center',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            marginBottom: 20,
            fontFamily: 'Arial, sans-serif',
            background: 'linear-gradient(135deg, #64b5f6, #81c784, #ffb74d)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              fontSize: 32,
              color: 'rgba(255, 255, 255, 0.9)',
              textAlign: 'center',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
              fontFamily: 'Arial, sans-serif',
              fontWeight: '300',
            }}
          >
            {subtitle}
          </p>
        )}
      </AbsoluteFill>
    );
  };

  return (
    <AbsoluteFill>
      {/* Background particle system throughout */}
      <ParticleSystem
        particleCount={80}
        emissionRate={2}
        colors={['#64b5f6', '#81c784', '#ffb74d', '#f06292', '#ba68c8']}
        gravity={0.01}
        turbulence={0.03}
        glowIntensity={0.8}
        quantumEffects={true}
      />

      <TransitionSeries>
        {/* Scene 1: Introduction with title */}
        <TransitionSeries.Sequence durationInFrames={120}>
          <AbsoluteFill
            style={{
              background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
            }}
          />
          <VisualEffects
            effectType="holographic"
            intensity={0.6}
            colorShift={true}
            etherealGlow={true}
            scientificAesthetic={true}
          />
          <TitleOverlay
            title="Reverse Gravity"
            subtitle="Exploring Einstein's Curved Spacetime"
          />
        </TransitionSeries.Sequence>

        {/* Transition 1: Fade */}
        <TransitionSeries.Transition
          timing={springTiming({
            config: { damping: 200, stiffness: 100 },
          })}
          presentation={fade()}
        />

        {/* Scene 2: Split Screen Gravity Comparison */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <SplitScreen
            dividerPosition={0.5}
            objects={[
              { id: 'sphere1', x: 200, startFrame: 0, color: '#ff6b6b', size: 40 },
              { id: 'cube1', x: 350, startFrame: 30, color: '#4ecdc4', size: 35 },
              { id: 'sphere2', x: 500, startFrame: 60, color: '#45b7d1', size: 45 },
              { id: 'triangle1', x: 650, startFrame: 90, color: '#96ceb4', size: 38 },
              { id: 'sphere3', x: 800, startFrame: 120, color: '#feca57', size: 42 },
            ]}
          />
          <VisualEffects
            effectType="glow"
            intensity={0.8}
            colorShift={true}
            morphing={true}
            scientificAesthetic={true}
          />
        </TransitionSeries.Sequence>

        {/* Transition 2: Clock Wipe */}
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: 45 })}
          presentation={clockWipe()}
        />

        {/* Scene 3: Spacetime Fabric Visualization */}
        <TransitionSeries.Sequence durationInFrames={200}>
          <SpacetimeFabric
            masses={[
              { x: 400, y: 300, mass: 120, color: '#ff6b6b', id: 'star' },
              { x: 700, y: 500, mass: 60, color: '#4ecdc4', id: 'planet1' },
              { x: 200, y: 700, mass: 40, color: '#45b7d1', id: 'planet2' },
            ]}
            gridSize={35}
            showObjectPaths={true}
            etherealGlow={true}
          />
          <VisualEffects
            effectType="quantum"
            intensity={0.9}
            colorShift={true}
            etherealGlow={true}
            scientificAesthetic={true}
          />
        </TransitionSeries.Sequence>

        {/* Transition 3: Wipe */}
        <TransitionSeries.Transition
          timing={springTiming({
            config: { damping: 150, stiffness: 80 },
          })}
          presentation={wipe({ direction: 'from-left' })}
        />

        {/* Scene 4: Enhanced Spacetime with More Complex Physics */}
        <TransitionSeries.Sequence durationInFrames={200}>
          <SpacetimeFabric
            masses={[
              { x: 300, y: 200, mass: 150, color: '#ff6b6b', id: 'blackhole' },
              { x: 600, y: 400, mass: 80, color: '#4ecdc4', id: 'star1' },
              { x: 800, y: 700, mass: 60, color: '#45b7d1', id: 'star2' },
              { x: 150, y: 600, mass: 45, color: '#96ceb4', id: 'planet1' },
            ]}
            gridSize={30}
            showObjectPaths={true}
            etherealGlow={true}
          />
          <VisualEffects
            effectType="chromatic"
            intensity={1.0}
            colorShift={true}
            morphing={true}
            etherealGlow={true}
            scientificAesthetic={true}
          />

          {/* Advanced physics overlay */}
          <AbsoluteFill
            style={{
              background: `
                radial-gradient(ellipse at 300px 200px, rgba(255, 107, 107, 0.2) 0%, transparent 40%),
                radial-gradient(ellipse at 600px 400px, rgba(76, 236, 196, 0.15) 0%, transparent 35%),
                radial-gradient(ellipse at 800px 700px, rgba(69, 183, 209, 0.15) 0%, transparent 35%)
              `,
              opacity: interpolate(
                Math.sin(frame * 0.05),
                [-1, 1],
                [0.6, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
              ),
            }}
          />
        </TransitionSeries.Sequence>

        {/* Transition 4: Fade with bloom */}
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: 30 })}
          presentation={fade()}
        />

        {/* Scene 5: Final Revelation - Pure Physics Beauty */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <AbsoluteFill
            style={{
              background: `
                radial-gradient(ellipse at 30% 70%, rgba(100, 181, 246, 0.3) 0%, transparent 50%),
                radial-gradient(ellipse at 70% 30%, rgba(129, 199, 132, 0.3) 0%, transparent 50%),
                linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)
              `,
            }}
          />

          {/* Mathematical equations overlay */}
          <AbsoluteFill
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'rgba(255, 255, 255, 0.9)',
              fontFamily: 'Arial, sans-serif',
              fontSize: 48,
              textAlign: 'center',
              opacity: interpolate(
                frame % 150,
                [0, 30, 120, 150],
                [0, 1, 1, 0],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
              ),
            }}
          >
            <div style={{ marginBottom: 40 }}>
              E = mc²
            </div>
            <div style={{ fontSize: 36, opacity: 0.8 }}>
              Curvature = Energy-Momentum
            </div>
          </AbsoluteFill>

          <VisualEffects
            effectType="bloom"
            intensity={1.2}
            colorShift={true}
            morphing={true}
            etherealGlow={true}
            scientificAesthetic={true}
          />

          <ParticleSystem
            particleCount={150}
            emissionRate={4}
            colors={['#ffffff', '#64b5f6', '#81c784']}
            gravity={-0.02}
            turbulence={0.08}
            glowIntensity={1.2}
            quantumEffects={true}
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* Global enhancement layer */}
      <AbsoluteFill
        style={{
          background: `
            linear-gradient(45deg,
              transparent 0%,
              rgba(100, 181, 246, 0.05) 25%,
              transparent 50%,
              rgba(129, 199, 132, 0.05) 75%,
              transparent 100%)
          `,
          pointerEvents: 'none',
          zIndex: 999,
          opacity: interpolate(
            Math.sin(frame * 0.02),
            [-1, 1],
            [0.5, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          ),
        }}
      />
    </AbsoluteFill>
  );
};