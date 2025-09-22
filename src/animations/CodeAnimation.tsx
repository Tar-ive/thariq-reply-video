import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';

interface CodeAnimationProps {
  code: string;
  language: string;
  animationType: 'compile' | 'transform' | 'highlight';
  startFrame?: number;
  duration?: number;
}

export const CodeAnimation: React.FC<CodeAnimationProps> = ({
  code,
  language,
  animationType,
  startFrame = 0,
  duration = 120,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = Math.max(0, frame - startFrame);

  // Spring animation for smooth entrance
  const springProgress = spring({
    frame: relativeFrame,
    fps,
    config: {
      damping: 200,
      stiffness: 100,
      mass: 0.5,
    },
  });

  // Different animation styles based on type
  const getAnimationStyle = () => {
    switch (animationType) {
      case 'compile':
        return getCompileAnimation(relativeFrame, duration);
      case 'transform':
        return getTransformAnimation(relativeFrame, duration);
      case 'highlight':
        return getHighlightAnimation(relativeFrame, duration);
      default:
        return {};
    }
  };

  const getCompileAnimation = (frame: number, duration: number) => {
    const progress = interpolate(frame, [0, duration], [0, 1], {
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
    });

    // Typewriter effect for code appearance
    const codeLength = code.length;
    const visibleChars = Math.floor(progress * codeLength);
    const displayCode = code.substring(0, visibleChars);

    // Cursor blink effect
    const cursorOpacity = interpolate(
      frame % 30,
      [0, 15, 30],
      [1, 0, 1]
    );

    return {
      displayCode,
      cursorOpacity,
      transform: `scale(${0.8 + 0.2 * springProgress})`,
      opacity: springProgress,
    };
  };

  const getTransformAnimation = (frame: number, duration: number) => {
    const progress = interpolate(frame, [0, duration], [0, 1], {
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    });

    // Sliding transformation effect
    const translateX = interpolate(progress, [0, 0.5, 1], [-100, 0, 100]);
    const scale = interpolate(progress, [0, 0.5, 1], [0.8, 1.1, 1]);

    return {
      displayCode: code,
      transform: `translateX(${translateX}px) scale(${scale})`,
      opacity: 1,
    };
  };

  const getHighlightAnimation = (frame: number, duration: number) => {
    const progress = interpolate(frame, [0, duration], [0, 1], {
      extrapolateRight: 'clamp',
    });

    // Pulsing highlight effect
    const highlightIntensity = interpolate(
      Math.sin(progress * Math.PI * 4),
      [-1, 1],
      [0.2, 0.8]
    );

    return {
      displayCode: code,
      backgroundColor: `rgba(255, 215, 0, ${highlightIntensity})`,
      transform: 'scale(1)',
      opacity: 1,
    };
  };

  const animationStyle = getAnimationStyle();

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)',
        fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
      }}
    >
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(10px)',
          maxWidth: '80%',
          ...animationStyle,
        }}
      >
        <div
          style={{
            color: '#61dafb',
            fontSize: '14px',
            marginBottom: '12px',
            opacity: 0.7,
          }}
        >
          {language.toUpperCase()}
        </div>

        <pre
          style={{
            color: '#ffffff',
            fontSize: '16px',
            lineHeight: '1.5',
            margin: 0,
            whiteSpace: 'pre-wrap',
            ...animationStyle.backgroundColor && {
              backgroundColor: animationStyle.backgroundColor,
              padding: '8px',
              borderRadius: '4px',
            },
          }}
        >
          {animationStyle.displayCode || code}
          {animationType === 'compile' && (
            <span
              style={{
                opacity: animationStyle.cursorOpacity,
                color: '#61dafb',
                animation: 'blink 1s infinite',
              }}
            >
              |
            </span>
          )}
        </pre>
      </div>

      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </AbsoluteFill>
  );
};

export default CodeAnimation;