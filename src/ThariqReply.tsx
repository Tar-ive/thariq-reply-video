import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Audio,
  staticFile,
  random,
} from 'remotion';
import { TransitionSeries, linearTiming, springTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import { DynamicSubtitles } from './Subtitles';

// Hook (0-90 frames / 3 seconds) - Setup expectation
const HookClip: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const titleOpacity = spring({
    fps,
    frame,
    config: { damping: 200 },
  });

  const backgroundParticles = [...Array(20)].map((_, i) => {
    const x = interpolate(
      frame,
      [0, 90],
      [random(`x-${i}`) * width, random(`x2-${i}`) * width],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    const y = interpolate(
      frame,
      [0, 90],
      [random(`y-${i}`) * height, random(`y2-${i}`) * height],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: 4,
          height: 4,
          backgroundColor: '#3b82f6',
          borderRadius: '50%',
          opacity: 0.6,
          filter: 'blur(1px)',
        }}
      />
    );
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0b1e' }}>
      {/* Floating particles */}
      <AbsoluteFill>{backgroundParticles}</AbsoluteFill>

      {/* Main title */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          opacity: titleOpacity,
          padding: 40,
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontFamily: 'SF Pro Display, Arial, sans-serif',
            fontWeight: 'bold',
            color: '#ffffff',
            textAlign: 'center',
            textShadow: '0 8px 32px rgba(59, 130, 246, 0.5)',
            lineHeight: 1.2,
          }}
        >
          Hey Thariq! 👋
          <div
            style={{
              fontSize: 36,
              color: '#94a3b8',
              fontWeight: 'normal',
              marginTop: 20,
            }}
          >
            Loved your Claude Code tips!
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Surprise (90-180 frames / 3 seconds) - Impossible physics demonstration
const SurpriseClip: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Floating objects with impossible physics
  const objects = [...Array(8)].map((_, i) => {
    const size = 20 + random(`size-${i}`) * 40;
    const x = interpolate(
      frame,
      [0, 90],
      [width * 0.2, width * 0.8],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    const y = height * 0.3 + Math.sin((frame + i * 20) * 0.1) * 100;

    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: size,
          height: size,
          backgroundColor: `hsl(${200 + i * 20}, 70%, 60%)`,
          borderRadius: '50%',
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)',
          filter: 'blur(0.5px)',
        }}
      />
    );
  });

  const questionOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#1a0a2e' }}>
      {/* Floating objects */}
      <AbsoluteFill>{objects}</AbsoluteFill>

      {/* Question text */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'flex-start',
          paddingTop: 100,
          opacity: questionOpacity,
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontFamily: 'SF Pro Display, Arial, sans-serif',
            fontWeight: 'bold',
            color: '#ffffff',
            textAlign: 'center',
            textShadow: '0 4px 20px rgba(0,0,0,0.8)',
            lineHeight: 1.3,
          }}
        >
          What if objects could
          <div style={{ color: '#ff6b6b', marginTop: 10 }}>float upward?</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Comparison (180-360 frames / 6 seconds) - Normal vs reverse
const ComparisonClip: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const splitReveal = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Normal falling object
  const normalY = interpolate(
    frame,
    [30, 150],
    [height * 0.2, height * 0.8],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Reverse floating object
  const reverseY = interpolate(
    frame,
    [30, 150],
    [height * 0.8, height * 0.2],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#0f1419' }}>
      {/* Split screen divider */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          width: 4,
          height: '100%',
          backgroundColor: '#3b82f6',
          opacity: splitReveal,
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)',
        }}
      />

      {/* Normal physics side */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '50%',
          height: '100%',
          opacity: splitReveal,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: normalY,
            transform: 'translateX(-50%)',
            width: 60,
            height: 60,
            backgroundColor: '#ff6b6b',
            borderRadius: '50%',
            boxShadow: '0 0 20px rgba(255, 107, 107, 0.8)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 50,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 24,
            color: '#ffffff',
            fontWeight: 'bold',
          }}
        >
          Normal
        </div>
      </div>

      {/* Reverse physics side */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: '50%',
          height: '100%',
          opacity: splitReveal,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: reverseY,
            transform: 'translateX(-50%)',
            width: 60,
            height: 60,
            backgroundColor: '#4ecdc4',
            borderRadius: '50%',
            boxShadow: '0 0 20px rgba(78, 205, 196, 0.8)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 50,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 24,
            color: '#ffffff',
            fontWeight: 'bold',
          }}
        >
          Reverse
        </div>
      </div>

      {/* Labels */}
      <AbsoluteFill
        style={{
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingTop: 80,
          opacity: splitReveal,
        }}
      >
        <div
          style={{
            fontSize: 42,
            fontFamily: 'SF Pro Display, Arial, sans-serif',
            fontWeight: 'bold',
            color: '#ffffff',
            textAlign: 'center',
            textShadow: '0 4px 20px rgba(0,0,0,0.8)',
          }}
        >
          Physics Comparison
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Explanation (360-540 frames / 6 seconds) - Spacetime science
const ExplanationClip: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const textReveal = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Animated spacetime grid
  const gridOffset = (frame * 2) % 50;
  const gridLines = [];

  for (let i = 0; i < width / 25; i++) {
    gridLines.push(
      <div
        key={`v-${i}`}
        style={{
          position: 'absolute',
          left: i * 25 + gridOffset,
          top: 0,
          width: 1,
          height: '100%',
          backgroundColor: 'rgba(59, 130, 246, 0.3)',
        }}
      />
    );
  }

  for (let i = 0; i < height / 25; i++) {
    gridLines.push(
      <div
        key={`h-${i}`}
        style={{
          position: 'absolute',
          left: 0,
          top: i * 25 + gridOffset,
          width: '100%',
          height: 1,
          backgroundColor: 'rgba(59, 130, 246, 0.3)',
        }}
      />
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0a0a' }}>
      {/* Animated grid */}
      <AbsoluteFill>{gridLines}</AbsoluteFill>

      {/* Explanation text */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: 60,
          opacity: textReveal,
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderRadius: 20,
            padding: 40,
            border: '2px solid #3b82f6',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 48,
              fontFamily: 'SF Pro Display, Arial, sans-serif',
              fontWeight: 'bold',
              color: '#ffffff',
              marginBottom: 30,
              textShadow: '0 4px 20px rgba(59, 130, 246, 0.8)',
            }}
          >
            In Spacetime...
          </div>
          <div
            style={{
              fontSize: 32,
              fontFamily: 'Inter, Arial, sans-serif',
              color: '#cbd5e1',
              lineHeight: 1.4,
            }}
          >
            Mass curves spacetime,
            <br />
            creating what we call
            <span style={{ color: '#4ecdc4', fontWeight: 'bold' }}> gravity</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Revelation (540-720 frames / 6 seconds) - Mind-blowing conclusion
const RevelationClip: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const explosionScale = spring({
    fps,
    frame,
    config: { damping: 100 },
  });

  const textScale = spring({
    fps,
    frame: frame - 30,
    config: { damping: 150 },
  });

  // Particle explosion effect
  const particles = [...Array(50)].map((_, i) => {
    const angle = (i / 50) * Math.PI * 2;
    const distance = explosionScale * 200;
    const x = width / 2 + Math.cos(angle) * distance;
    const y = height / 2 + Math.sin(angle) * distance;
    const size = 4 + random(`particle-${i}`) * 8;

    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: size,
          height: size,
          backgroundColor: `hsl(${60 + i * 3}, 100%, 60%)`,
          borderRadius: '50%',
          opacity: Math.max(0, 1 - explosionScale),
          filter: 'blur(1px)',
        }}
      />
    );
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      {/* Particle explosion */}
      <AbsoluteFill>{particles}</AbsoluteFill>

      {/* Revelation text */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          transform: `scale(${textScale})`,
        }}
      >
        <div
          style={{
            textAlign: 'center',
            padding: 40,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontFamily: 'SF Pro Display, Arial, sans-serif',
              fontWeight: 'bold',
              color: '#ffffff',
              marginBottom: 20,
              textShadow: '0 0 40px rgba(255, 255, 255, 0.8)',
            }}
          >
            MIND = BLOWN 🤯
          </div>
          <div
            style={{
              fontSize: 36,
              color: '#ffd700',
              fontWeight: 'bold',
              textShadow: '0 0 20px rgba(255, 215, 0, 0.8)',
            }}
          >
            Thanks for the inspo, Thariq!
          </div>
          <div
            style={{
              fontSize: 24,
              color: '#94a3b8',
              marginTop: 30,
              fontFamily: 'Monaco, monospace',
            }}
          >
            // Made with Claude Code + Remotion
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Main composition with enhanced audio and transitions
export const ThariqReply: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Background music bed */}
      <Audio src={staticFile('audio/music-bed.mp3')} volume={0.3} />

      {/* Ambient laboratory sounds */}
      <Audio src={staticFile('audio/ambient.mp3')} volume={0.2} />

      {/* Main narration */}
      <Audio src={staticFile('audio/narration.mp3')} volume={0.8} />

      <TransitionSeries>
        {/* Hook (0-3s) */}
        <TransitionSeries.Sequence durationInFrames={90}>
          <HookClip />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 15 })}
          presentation={fade()}
        />

        {/* Surprise (3-6s) */}
        <TransitionSeries.Sequence durationInFrames={90}>
          <SurpriseClip />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: 15 })}
          presentation={wipe({ direction: 'from-left' })}
        />

        {/* Comparison (6-12s) */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <ComparisonClip />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          timing={springTiming({ config: { damping: 150 }, durationInFrames: 15 })}
          presentation={slide({ direction: 'from-bottom' })}
        />

        {/* Explanation (12-18s) */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <ExplanationClip />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: 15 })}
          presentation={fade()}
        />

        {/* Revelation (18-24s) */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <RevelationClip />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* Sound effects at key moments */}
      <Sequence from={90} durationInFrames={15}>
        <Audio src={staticFile('audio/whoosh.mp3')} volume={0.6} />
      </Sequence>

      <Sequence from={270} durationInFrames={15}>
        <Audio src={staticFile('audio/whoosh.mp3')} volume={0.6} />
      </Sequence>

      <Sequence from={450} durationInFrames={15}>
        <Audio src={staticFile('audio/chime.mp3')} volume={0.7} />
      </Sequence>

      <Sequence from={540} durationInFrames={30}>
        <Audio src={staticFile('audio/chime.mp3')} volume={0.9} />
      </Sequence>

      {/* Subtitles overlay */}
      <DynamicSubtitles />
    </AbsoluteFill>
  );
};