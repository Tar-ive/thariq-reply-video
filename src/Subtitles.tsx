import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

interface SubtitleProps {
  text: string;
  startFrame: number;
  endFrame: number;
  style?: 'intro' | 'demo' | 'close';
}

// Dynamic Subtitles Component
export const DynamicSubtitles: React.FC = () => {
  const frame = useCurrentFrame();

  // Subtitle timing mapped to educational story beats (24s total, 30fps)
  const subtitles = [
    // Hook (0-3s) - Setup expectation
    { text: "Hey Thariq!", startFrame: 0, endFrame: 30, style: 'intro' as const },
    { text: "Loved your Claude Code tips!", startFrame: 30, endFrame: 90, style: 'intro' as const },

    // Surprise (3-6s) - Impossible physics
    { text: "What if objects could float upward?", startFrame: 105, endFrame: 180, style: 'demo' as const },

    // Comparison (6-12s) - Normal vs reverse
    { text: "Normal physics vs. reverse gravity", startFrame: 195, endFrame: 270, style: 'demo' as const },
    { text: "Two different realities!", startFrame: 270, endFrame: 345, style: 'demo' as const },

    // Explanation (12-18s) - Spacetime science
    { text: "In spacetime...", startFrame: 360, endFrame: 420, style: 'close' as const },
    { text: "Mass curves spacetime, creating gravity", startFrame: 420, endFrame: 525, style: 'close' as const },

    // Revelation (18-24s) - Mind-blowing conclusion
    { text: "MIND = BLOWN! 🤯", startFrame: 540, endFrame: 600, style: 'close' as const },
    { text: "Thanks for the inspo, Thariq!", startFrame: 600, endFrame: 720, style: 'close' as const },
  ];

  return (
    <div style={{
      position: 'absolute',
      bottom: '12%',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 10,
      width: '95%',
      textAlign: 'center'
    }}>
      {subtitles.map((subtitle, index) => (
        <Subtitle
          key={index}
          text={subtitle.text}
          startFrame={subtitle.startFrame}
          endFrame={subtitle.endFrame}
          style={subtitle.style}
        />
      ))}
    </div>
  );
};

const Subtitle: React.FC<SubtitleProps> = ({ text, startFrame, endFrame, style = 'intro' }) => {
  const frame = useCurrentFrame();

  // Show subtitle only during its time window
  if (frame < startFrame || frame > endFrame) {
    return null;
  }

  // Animation progress
  const progress = (frame - startFrame) / (endFrame - startFrame);

  // Entrance animation
  const opacity = interpolate(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const scale = interpolate(progress, [0, 0.1], [0.8, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Style variations for different clips - optimized for vertical format
  const getSubtitleStyle = (styleType: string) => {
    const baseStyle = {
      fontSize: '2.2rem',
      fontWeight: 'bold',
      textShadow: '2px 2px 8px rgba(0,0,0,0.9)',
      padding: '12px 24px',
      borderRadius: '12px',
      opacity,
      transform: `scale(${scale})`,
      transition: 'all 0.3s ease',
      filter: progress > 0.05 && progress < 0.95 ? 'none' : 'blur(0.5px)',
      maxWidth: '100%',
      wordWrap: 'break-word',
      lineHeight: 1.2,
    };

    switch (styleType) {
      case 'intro':
        return {
          ...baseStyle,
          color: '#ffffff',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.95), rgba(139, 92, 246, 0.95))',
          border: '2px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)',
        };

      case 'demo':
        return {
          ...baseStyle,
          color: '#4ecdc4',
          background: 'rgba(0, 0, 0, 0.9)',
          border: '2px solid #4ecdc4',
          fontFamily: 'SF Pro Display, Arial, sans-serif',
          letterSpacing: '1px',
          boxShadow: '0 8px 32px rgba(78, 205, 196, 0.4)',
        };

      case 'close':
        return {
          ...baseStyle,
          color: '#ffffff',
          background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.95), rgba(255, 107, 107, 0.95))',
          border: '2px solid rgba(255, 255, 255, 0.6)',
          boxShadow: '0 8px 32px rgba(255, 215, 0, 0.5)',
        };

      default:
        return baseStyle;
    }
  };

  return (
    <div style={getSubtitleStyle(style)}>
      {text}
    </div>
  );
};

// Animated Text Effects
export const TypewriterText: React.FC<{ text: string; speed?: number }> = ({
  text,
  speed = 3
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const charactersShown = Math.floor(frame / speed);
  const displayText = text.slice(0, charactersShown);

  return (
    <span style={{ fontFamily: 'monospace' }}>
      {displayText}
      {charactersShown < text.length && (
        <span style={{
          animation: 'blink 1s infinite',
          color: '#00ff00'
        }}>
          |
        </span>
      )}
    </span>
  );
};

// Bouncy Text Animation
export const BouncyText: React.FC<{ text: string; delay?: number }> = ({
  text,
  delay = 0
}) => {
  const frame = useCurrentFrame();

  return (
    <span>
      {text.split('').map((char, index) => {
        const charDelay = delay + index * 3;
        const bounceScale = interpolate(
          frame,
          [charDelay, charDelay + 10, charDelay + 20],
          [1, 1.3, 1],
          {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }
        );

        return (
          <span
            key={index}
            style={{
              display: 'inline-block',
              transform: `scale(${bounceScale})`,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        );
      })}
    </span>
  );
};

// Glitch Text Effect
export const GlitchText: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();

  const shouldGlitch = frame % 60 < 5; // Glitch every 2 seconds for 5 frames

  if (!shouldGlitch) {
    return <span>{text}</span>;
  }

  const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const glitchedText = text
    .split('')
    .map(char => Math.random() > 0.7 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char)
    .join('');

  return (
    <span style={{
      color: Math.random() > 0.5 ? '#ff0000' : '#00ff00',
      textShadow: '2px 0 #ff0000, -2px 0 #00ff00',
    }}>
      {glitchedText}
    </span>
  );
};

export default DynamicSubtitles;