import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Easing,
} from 'remotion';
import { CodeAnimation } from './CodeAnimation';
import { ParticleEffects } from './ParticleEffects';

interface ManimSceneProps {
  scene: 'intro' | 'demo' | 'conclusion';
  onTransition?: () => void;
}

export const ManimScene: React.FC<ManimSceneProps> = ({ scene, onTransition }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Scene configurations
  const sceneConfig = {
    intro: {
      code: `// Welcome to AI-Powered Development
const revolution = new TechnologicalShift({
  paradigm: 'AI-First Development',
  impact: 'Exponential',
  future: 'Now'
});

revolution.start();`,
      language: 'javascript',
      animationType: 'compile' as const,
      particleType: 'sparks' as const,
    },
    demo: {
      code: `// Traditional Development
function createAPI() {
  // Hours of manual coding...
  return complexImplementation;
}

// ↓ AI-Powered Transformation ↓

// Modern AI Development
const api = await AI.generate({
  description: "REST API with auth",
  framework: "Express.js",
  database: "PostgreSQL"
});`,
      language: 'javascript',
      animationType: 'transform' as const,
      particleType: 'flow' as const,
    },
    conclusion: {
      code: `// The Future is Here
class AIRevolution {
  constructor() {
    this.possibilities = Infinity;
    this.limitations = null;
    this.timeToStart = 'now';
  }

  async transform(industry) {
    return await this.reimagine(industry);
  }
}

new AIRevolution().transform('software');`,
      language: 'javascript',
      animationType: 'highlight' as const,
      particleType: 'burst' as const,
    },
  };

  const currentScene = sceneConfig[scene];

  // Background animation
  const backgroundProgress = interpolate(
    frame,
    [0, durationInFrames],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const gradientShift = interpolate(
    backgroundProgress,
    [0, 1],
    [0, 360]
  );

  // Title animation for intro
  const titleOpacity = spring({
    frame: frame - 30,
    fps,
    config: {
      damping: 200,
      stiffness: 100,
    },
  });

  const titleTransform = interpolate(
    titleOpacity,
    [0, 1],
    [-50, 0],
    { easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill>
      {/* Animated Background */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: `linear-gradient(${gradientShift}deg,
            #0f0f0f 0%,
            #1a1a2e 25%,
            #16213e 50%,
            #0f3460 75%,
            #533483 100%)`,
          opacity: 0.9,
        }}
      />

      {/* Particle Effects */}
      <ParticleEffects
        type={currentScene.particleType}
        intensity={scene === 'demo' ? 0.8 : 0.6}
        startFrame={0}
      />

      {/* Scene Title */}
      {scene === 'intro' && (
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: `translateX(-50%) translateY(${titleTransform}px)`,
            opacity: titleOpacity,
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#ffffff',
              textShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
              margin: 0,
              fontFamily: 'Arial, sans-serif',
            }}
          >
            AI-Powered Development
          </h1>
          <p
            style={{
              fontSize: '20px',
              color: '#61dafb',
              margin: '8px 0 0 0',
              fontFamily: 'Arial, sans-serif',
            }}
          >
            The Future of Software Engineering
          </p>
        </div>
      )}

      {/* Main Code Animation */}
      <Sequence from={scene === 'intro' ? 60 : 0}>
        <CodeAnimation
          code={currentScene.code}
          language={currentScene.language}
          animationType={currentScene.animationType}
          duration={180}
        />
      </Sequence>

      {/* Transformation Arrow for Demo Scene */}
      {scene === 'demo' && (
        <Sequence from={90} durationInFrames={60}>
          <TransformationArrow />
        </Sequence>
      )}

      {/* Scene Transition Effects */}
      {frame > durationInFrames - 30 && (
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle, transparent 0%, rgba(0,0,0,0.8) 70%)',
            opacity: interpolate(
              frame,
              [durationInFrames - 30, durationInFrames],
              [0, 1]
            ),
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// Transformation Arrow Component
const TransformationArrow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const arrowProgress = spring({
    frame,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
    },
  });

  const arrowScale = interpolate(arrowProgress, [0, 1], [0, 1]);
  const arrowRotation = interpolate(frame, [0, 60], [0, 360]);

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${arrowScale}) rotate(${arrowRotation}deg)`,
        color: '#61dafb',
        fontSize: '48px',
        textShadow: '0 0 20px #61dafb',
      }}
    >
      ↓
    </div>
  );
};

export default ManimScene;