import React from 'react';

interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'code';
  glow?: boolean;
  glitch?: boolean;
  animated?: boolean;
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'orange' | 'white';
  children: React.ReactNode;
  className?: string;
}

const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  glow = false,
  glitch = false,
  animated = false,
  color = 'cyan',
  children,
  className = ''
}) => {
  const baseClasses = {
    h1: 'text-4xl md:text-6xl font-bold tracking-tight',
    h2: 'text-3xl md:text-4xl font-bold tracking-tight',
    h3: 'text-2xl md:text-3xl font-semibold',
    h4: 'text-xl md:text-2xl font-semibold',
    body: 'text-base md:text-lg',
    caption: 'text-sm opacity-70',
    code: 'font-mono text-sm bg-gray-800 px-2 py-1 rounded'
  };

  const colorClasses = {
    cyan: 'text-cyan-400',
    purple: 'text-purple-400',
    pink: 'text-pink-400',
    green: 'text-green-400',
    orange: 'text-orange-400',
    white: 'text-white'
  };

  const Component = variant === 'body' || variant === 'caption' || variant === 'code'
    ? 'span'
    : variant as keyof JSX.IntrinsicElements;

  let classes = `${baseClasses[variant]} ${colorClasses[color]} ${className}`;

  if (glow) {
    classes += ' neon-glow';
  }

  if (glitch) {
    classes += ' glitch-text';
  }

  if (animated) {
    classes += ' animate-pulse';
  }

  const content = typeof children === 'string' && glitch ? (
    <Component
      className={classes}
      data-text={children}
    >
      {children}
    </Component>
  ) : (
    <Component className={classes}>
      {children}
    </Component>
  );

  return content;
};

// Specialized Typography Components
export const GlitchTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => (
  <Typography
    variant="h1"
    glitch
    glow
    color="cyan"
    className={`mb-8 text-center ${className}`}
  >
    {children}
  </Typography>
);

export const NeonHeading: React.FC<{
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4';
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'orange';
  className?: string;
}> = ({
  children,
  variant = 'h2',
  color = 'purple',
  className = ''
}) => (
  <Typography
    variant={variant}
    glow
    color={color}
    className={`mb-4 ${className}`}
  >
    {children}
  </Typography>
);

export const CodeText: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => (
  <Typography
    variant="code"
    color="green"
    className={`neon-border ${className}`}
  >
    {children}
  </Typography>
);

export const AnimatedText: React.FC<{
  text: string;
  speed?: number;
  className?: string;
}> = ({
  text,
  speed = 50,
  className = ''
}) => {
  const [displayText, setDisplayText] = React.useState('');
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <Typography variant="body" color="cyan" className={className}>
      {displayText}
      {currentIndex < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </Typography>
  );
};

// Matrix-style falling text effect
export const MatrixText: React.FC<{
  text: string;
  className?: string;
}> = ({ text, className = '' }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Typography variant="code" color="green" className="relative z-10">
        {text}
      </Typography>
      <div className="absolute inset-0 opacity-20">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute text-green-400 font-mono text-xs"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animation: `dataStream ${2 + Math.random() * 3}s linear infinite`,
            }}
          >
            {String.fromCharCode(0x30A0 + Math.random() * 96)}
          </div>
        ))}
      </div>
    </div>
  );
};

// Holographic text with scan line effect
export const HologramText: React.FC<{
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body';
  className?: string;
}> = ({ children, variant = 'h2', className = '' }) => {
  return (
    <div className={`hologram p-4 ${className}`}>
      <Typography variant={variant} color="cyan" glow>
        {children}
      </Typography>
    </div>
  );
};

// Quantum-style text with particle effects
export const QuantumText: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <Typography variant="h2" color="purple" glow className="relative z-10">
        {children}
      </Typography>

      {/* Particle effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animation: `pulse 2s ease-in-out infinite alternate`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Status display with real-time updates
export const StatusDisplay: React.FC<{
  status: 'online' | 'offline' | 'processing' | 'error';
  label: string;
  className?: string;
}> = ({ status, label, className = '' }) => {
  const statusConfig = {
    online: { color: 'green' as const, icon: '●', text: 'ONLINE' },
    offline: { color: 'white' as const, icon: '○', text: 'OFFLINE' },
    processing: { color: 'orange' as const, icon: '◐', text: 'PROCESSING' },
    error: { color: 'pink' as const, icon: '●', text: 'ERROR' }
  };

  const config = statusConfig[status];

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Typography variant="code" color={config.color} animated={status === 'processing'}>
        {config.icon}
      </Typography>
      <Typography variant="caption" color="white">
        {label}:
      </Typography>
      <Typography variant="caption" color={config.color} glow>
        {config.text}
      </Typography>
    </div>
  );
};

export default Typography;