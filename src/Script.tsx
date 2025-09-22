import React from 'react';
import { Sequence, useCurrentFrame, useVideoConfig } from 'remotion';
import { interpolate, spring } from 'remotion';

// Video Script Configuration
export const SCRIPT_CONFIG = {
  totalDuration: 900, // 30 seconds at 30fps
  clips: {
    intro: { start: 0, duration: 300 }, // 0-10s
    demo: { start: 300, duration: 300 }, // 10-20s
    close: { start: 600, duration: 300 }, // 20-30s
  }
};

// Narration Script with Timing
export const NARRATION_SCRIPT = {
  intro: {
    text: "Hey Thariq, loved your Claude Code video tips! Here's my take.",
    timing: [
      { start: 0, end: 1.5, text: "Hey Thariq," },
      { start: 1.5, end: 4.5, text: "loved your Claude Code video tips!" },
      { start: 4.5, end: 7, text: "Here's my take." }
    ],
    tone: "excited",
    energy: "high"
  },
  demo: {
    text: "Watch Claude Code spawn multiple agents, coordinate parallel tasks, and build full-stack apps in seconds!",
    timing: [
      { start: 10, end: 13, text: "Watch Claude Code spawn multiple agents," },
      { start: 13, end: 16, text: "coordinate parallel tasks," },
      { start: 16, end: 20, text: "and build full-stack apps in seconds!" }
    ],
    tone: "demonstrative",
    energy: "building"
  },
  close: {
    text: "Thanks for the inspo! Claude Code + SPARC methodology = developer superpowers!",
    timing: [
      { start: 20, end: 22, text: "Thanks for the inspo!" },
      { start: 22, end: 26, text: "Claude Code + SPARC methodology" },
      { start: 26, end: 30, text: "= developer superpowers!" }
    ],
    tone: "grateful",
    energy: "climactic"
  }
};

// Visual Cues and Scene Descriptions
export const VISUAL_CUES = {
  intro: {
    background: "gradient-purple-blue",
    avatar: "animated-wave",
    text: "bouncy-entrance",
    effects: ["particle-sparkles", "glow-border"]
  },
  demo: {
    background: "code-matrix",
    overlay: "terminal-simulation",
    text: "typewriter-effect",
    effects: ["code-rain", "progress-bars", "agent-icons"]
  },
  close: {
    background: "success-gradient",
    avatar: "thumbs-up",
    text: "scale-celebration",
    effects: ["confetti", "shine-sweep", "logo-reveal"]
  }
};

// Main Script Component
export const VideoScript: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <>
      {/* CLIP 1: Intro (0-10s) */}
      <Sequence from={0} durationInFrames={300}>
        <IntroClip />
      </Sequence>

      {/* CLIP 2: Demo (10-20s) */}
      <Sequence from={300} durationInFrames={300}>
        <DemoClip />
      </Sequence>

      {/* CLIP 3: Close (20-30s) */}
      <Sequence from={600} durationInFrames={300}>
        <CloseClip />
      </Sequence>
    </>
  );
};

// Individual Clip Components
const IntroClip: React.FC = () => {
  const frame = useCurrentFrame();

  const scale = spring({
    frame,
    fps: 30,
    config: {
      damping: 8,
      stiffness: 120,
    },
  });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transform: `scale(${scale})`,
    }}>
      <h1 style={{
        fontSize: '4rem',
        color: 'white',
        textAlign: 'center',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        fontWeight: 'bold'
      }}>
        Hey Thariq! 👋
      </h1>
    </div>
  );
};

const DemoClip: React.FC = () => {
  const frame = useCurrentFrame();

  const codeOpacity = interpolate(frame, [0, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#0a0a0a',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Code Matrix Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: codeOpacity,
        background: 'repeating-linear-gradient(45deg, #00ff00 0%, #003300 50%)',
        backgroundSize: '2px 2px'
      }} />

      {/* Terminal Overlay */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: '#00ff00',
        fontFamily: 'monospace',
        fontSize: '2rem',
        textAlign: 'center'
      }}>
        <div>$ claude code --spawn-agents --parallel</div>
        <div style={{ marginTop: '20px', color: '#ffff00' }}>
          ⚡ Spawning 5 agents...
        </div>
        <div style={{ marginTop: '10px', color: '#ff6600' }}>
          🚀 Building full-stack app...
        </div>
      </div>
    </div>
  );
};

const CloseClip: React.FC = () => {
  const frame = useCurrentFrame();

  const confettiY = interpolate(frame, [0, 300], [-100, 1080], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      {/* Confetti Effect */}
      <div style={{
        position: 'absolute',
        top: confettiY,
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '3rem'
      }}>
        🎉✨🚀⚡🎊
      </div>

      <div style={{ textAlign: 'center', zIndex: 2 }}>
        <h1 style={{
          fontSize: '3.5rem',
          color: 'white',
          textShadow: '3px 3px 6px rgba(0,0,0,0.5)',
          marginBottom: '20px'
        }}>
          Thanks for the inspo! 🙏
        </h1>
        <h2 style={{
          fontSize: '2rem',
          color: '#fff',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}>
          Claude Code = Developer Superpowers! 💪
        </h2>
      </div>
    </div>
  );
};

export default VideoScript;