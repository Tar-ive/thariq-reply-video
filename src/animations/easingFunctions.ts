/**
 * Custom easing functions for smooth animations
 * Based on popular easing curves with Manim-style smoothness
 */

export const EasingFunctions = {
  // Smooth in-out for natural feeling animations
  smoothInOut: (t: number): number => {
    return t * t * (3 - 2 * t);
  },

  // Elastic ease for bouncy effects
  elasticOut: (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0
      ? 0
      : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },

  // Back ease for overshoot effect
  backOut: (t: number): number => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },

  // Exponential for dramatic emphasis
  expoOut: (t: number): number => {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  },

  // Circular for smooth curves
  circOut: (t: number): number => {
    return Math.sqrt(1 - Math.pow(t - 1, 2));
  },

  // Quintic for very smooth transitions
  quinticInOut: (t: number): number => {
    return t < 0.5
      ? 16 * t * t * t * t * t
      : 1 - Math.pow(-2 * t + 2, 5) / 2;
  },

  // Custom Manim-style ease
  manimSmooth: (t: number): number => {
    // Similar to Manim's smooth() function
    return -2 * t * t * t + 3 * t * t;
  },

  // Bounce for playful animations
  bounceOut: (t: number): number => {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  },

  // Spring physics simulation
  spring: (t: number, tension = 300, friction = 20): number => {
    const w = Math.sqrt(tension);
    const zeta = friction / (2 * Math.sqrt(tension));

    if (zeta < 1) {
      // Underdamped
      const wd = w * Math.sqrt(1 - zeta * zeta);
      return 1 - Math.exp(-zeta * w * t) * Math.cos(wd * t);
    } else {
      // Overdamped
      return 1 - Math.exp(-w * t);
    }
  },

  // Code typing effect
  typewriter: (t: number, jitter = 0.1): number => {
    const base = Math.min(t, 1);
    const noise = (Math.random() - 0.5) * jitter;
    return Math.max(0, Math.min(1, base + noise));
  },

  // Compilation progress
  compile: (t: number): number => {
    // Simulates compilation progress with occasional pauses
    if (t < 0.1) return t * 5; // Fast start
    if (t < 0.3) return 0.5 + (t - 0.1) * 1.25; // Slow middle
    if (t < 0.9) return 0.75 + (t - 0.3) * 0.417; // Steady progress
    return 1; // Complete
  },

  // Neural network training curve
  neuralTraining: (t: number): number => {
    // Exponential decay curve typical of loss functions
    return 1 - Math.exp(-t * 4);
  },

  // Code transformation
  morphTransform: (t: number): number => {
    // S-curve for smooth morphing
    const smoothed = EasingFunctions.manimSmooth(t);
    return smoothed * smoothed * (3 - 2 * smoothed);
  },
};

/**
 * Animation timing utilities
 */
export const AnimationTiming = {
  // Convert seconds to frames
  secondsToFrames: (seconds: number, fps: number): number => {
    return Math.round(seconds * fps);
  },

  // Convert frames to seconds
  framesToSeconds: (frames: number, fps: number): number => {
    return frames / fps;
  },

  // Create staggered animation delays
  stagger: (index: number, delay: number, fps: number): number => {
    return index * AnimationTiming.secondsToFrames(delay, fps);
  },

  // Calculate animation progress with custom easing
  getProgress: (
    frame: number,
    startFrame: number,
    duration: number,
    easingFn?: (t: number) => number
  ): number => {
    const t = Math.max(0, Math.min(1, (frame - startFrame) / duration));
    return easingFn ? easingFn(t) : t;
  },
};

/**
 * Color animation utilities
 */
export const ColorAnimations = {
  // Interpolate between hex colors
  interpolateHex: (color1: string, color2: string, t: number): string => {
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');

    const r1 = parseInt(hex1.substr(0, 2), 16);
    const g1 = parseInt(hex1.substr(2, 2), 16);
    const b1 = parseInt(hex1.substr(4, 2), 16);

    const r2 = parseInt(hex2.substr(0, 2), 16);
    const g2 = parseInt(hex2.substr(2, 2), 16);
    const b2 = parseInt(hex2.substr(4, 2), 16);

    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  },

  // Create syntax highlighting colors
  syntaxColors: {
    keyword: '#569cd6',
    string: '#ce9178',
    number: '#b5cea8',
    comment: '#6a9955',
    operator: '#d4d4d4',
    function: '#dcdcaa',
    variable: '#9cdcfe',
    type: '#4ec9b0',
  },
};

export default EasingFunctions;