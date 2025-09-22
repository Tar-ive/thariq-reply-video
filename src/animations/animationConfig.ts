/**
 * Animation configuration and timing controls
 * Centralized settings for all animation components
 */

export interface AnimationConfig {
  // Timing
  fps: number;
  defaultDuration: number;
  transitionDuration: number;

  // Easing
  defaultEasing: string;
  springConfig: {
    tension: number;
    friction: number;
    mass: number;
  };

  // Visual effects
  particleIntensity: number;
  glowIntensity: number;
  blurRadius: number;

  // Code animation
  typewriterSpeed: number;
  highlightDuration: number;
  transformSpeed: number;

  // Colors
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;

  // Particles
  particleConfig: {
    count: number;
    size: { min: number; max: number };
    speed: { min: number; max: number };
    life: { min: number; max: number };
  };
}

export const defaultAnimationConfig: AnimationConfig = {
  // Timing (60fps for smooth animations)
  fps: 60,
  defaultDuration: 120, // 2 seconds at 60fps
  transitionDuration: 30, // 0.5 seconds

  // Easing
  defaultEasing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  springConfig: {
    tension: 300,
    friction: 20,
    mass: 1,
  },

  // Visual effects
  particleIntensity: 0.6,
  glowIntensity: 0.8,
  blurRadius: 10,

  // Code animation
  typewriterSpeed: 50, // characters per second
  highlightDuration: 60, // 1 second
  transformSpeed: 90, // 1.5 seconds

  // Colors (VS Code Dark+ theme inspired)
  primaryColor: '#61dafb', // React blue
  secondaryColor: '#569cd6', // VS Code blue
  accentColor: '#ffd700', // Gold for highlights
  backgroundColor: '#1e1e1e', // Dark background
  textColor: '#ffffff', // White text

  // Particles
  particleConfig: {
    count: 100,
    size: { min: 1, max: 4 },
    speed: { min: 0.5, max: 3 },
    life: { min: 60, max: 180 }, // 1-3 seconds
  },
};

/**
 * Scene-specific configurations
 */
export const sceneConfigs = {
  intro: {
    ...defaultAnimationConfig,
    particleIntensity: 0.8,
    particleConfig: {
      ...defaultAnimationConfig.particleConfig,
      count: 150,
    },
    typewriterSpeed: 30, // Slower for dramatic effect
  },

  demo: {
    ...defaultAnimationConfig,
    particleIntensity: 0.7,
    transformSpeed: 120, // Slower transformation
    highlightDuration: 90,
  },

  conclusion: {
    ...defaultAnimationConfig,
    particleIntensity: 1.0,
    glowIntensity: 1.0,
    particleConfig: {
      ...defaultAnimationConfig.particleConfig,
      count: 200,
      size: { min: 2, max: 6 },
    },
  },
};

/**
 * Animation sequences and timing
 */
export const animationSequences = {
  intro: [
    { name: 'titleFadeIn', start: 0, duration: 60 },
    { name: 'particlesStart', start: 30, duration: -1 }, // Continuous
    { name: 'codeCompile', start: 90, duration: 180 },
    { name: 'logoReveal', start: 240, duration: 60 },
  ],

  demo: [
    { name: 'oldCodeShow', start: 0, duration: 90 },
    { name: 'transformArrow', start: 90, duration: 60 },
    { name: 'newCodeReveal', start: 150, duration: 90 },
    { name: 'comparisonHighlight', start: 240, duration: 120 },
  ],

  conclusion: [
    { name: 'burstEffect', start: 0, duration: 90 },
    { name: 'finalCode', start: 60, duration: 150 },
    { name: 'callToAction', start: 180, duration: 90 },
  ],
};

/**
 * Code snippets for animations
 */
export const codeSnippets = {
  intro: {
    title: '// Welcome to the Future',
    main: `const futureOfCoding = {
  paradigm: 'AI-First Development',
  productivity: 'Exponential',
  creativity: 'Unlimited',
  timeToMarket: 'Instant'
};

// The revolution starts now
futureOfCoding.activate();`,
    language: 'javascript',
  },

  demo: {
    before: `// Traditional Development
function buildAPI() {
  // Hours of planning...
  // Days of coding...
  // Weeks of testing...
  return manualImplementation;
}`,
    after: `// AI-Powered Development
const api = await AI.create({
  prompt: "Build REST API with auth",
  framework: "Express + TypeScript",
  database: "PostgreSQL",
  testing: "Jest + Supertest"
});
// Ready in minutes, not months!`,
    language: 'javascript',
  },

  conclusion: {
    main: `class DeveloperEvolution {
  constructor() {
    this.skills = ['coding', 'prompting', 'orchestrating'];
    this.tools = ['AI', 'automation', 'intelligence'];
    this.potential = Infinity;
  }

  async evolve() {
    return this.amplifyWith(AI);
  }
}

// Your journey begins now
new DeveloperEvolution().evolve();`,
    language: 'javascript',
  },
};

/**
 * Utility functions for animation config
 */
export const AnimationUtils = {
  // Get scene config
  getSceneConfig: (scene: keyof typeof sceneConfigs): AnimationConfig => {
    return sceneConfigs[scene] || defaultAnimationConfig;
  },

  // Get sequence timing
  getSequenceTiming: (scene: keyof typeof animationSequences, sequenceName: string) => {
    const sequences = animationSequences[scene];
    return sequences.find(seq => seq.name === sequenceName);
  },

  // Convert config to CSS variables
  toCSSVariables: (config: AnimationConfig): Record<string, string> => {
    return {
      '--primary-color': config.primaryColor,
      '--secondary-color': config.secondaryColor,
      '--accent-color': config.accentColor,
      '--background-color': config.backgroundColor,
      '--text-color': config.textColor,
      '--glow-intensity': config.glowIntensity.toString(),
      '--blur-radius': `${config.blurRadius}px`,
    };
  },

  // Calculate responsive sizes
  getResponsiveConfig: (width: number, height: number): Partial<AnimationConfig> => {
    const scale = Math.min(width / 1920, height / 1080);

    return {
      particleConfig: {
        count: Math.floor(defaultAnimationConfig.particleConfig.count * scale),
        size: {
          min: defaultAnimationConfig.particleConfig.size.min * scale,
          max: defaultAnimationConfig.particleConfig.size.max * scale,
        },
        speed: defaultAnimationConfig.particleConfig.speed,
        life: defaultAnimationConfig.particleConfig.life,
      },
    };
  },
};

export default defaultAnimationConfig;