import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
	random,
} from 'remotion';

interface AppleProps {
	startX?: number;
	startY?: number;
	floatDirection?: 'up' | 'down';
	delay?: number;
	scale?: number;
	rotationSpeed?: number;
	seed?: string;
}

export const Apple: React.FC<AppleProps> = ({
	startX = 540,
	startY = 1200,
	floatDirection = 'up',
	delay = 0,
	scale = 1,
	rotationSpeed = 1,
	seed = 'apple',
}) => {
	const frame = useCurrentFrame();
	const {fps, height} = useVideoConfig();

	// Apply delay
	const activeFrame = Math.max(0, frame - delay);

	// Upward floating animation (reverse gravity)
	const floatDistance = floatDirection === 'up' ? -800 : 800;
	const y = interpolate(
		activeFrame,
		[0, 180], // 6 seconds of floating
		[startY, startY + floatDistance],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	// Gentle horizontal drift using deterministic random
	const driftAmount = (random(seed + 'drift') - 0.5) * 100;
	const x = startX + interpolate(
		activeFrame,
		[0, 180],
		[0, driftAmount],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	// Rotation animation
	const rotation = (activeFrame * rotationSpeed * 2) % 360;

	// Gentle bobbing motion
	const bob = Math.sin(activeFrame * 0.1) * 5;

	// Scale animation for entrance
	const scaleAnimation = spring({
		fps,
		frame: activeFrame,
		config: {
			damping: 200,
			stiffness: 150,
		},
	});

	// Opacity for fade out at edges
	const opacity = interpolate(
		y,
		[height * 0.9, height * 0.1, -100],
		[1, 1, 0],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	return (
		<AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					left: x - 30 * scale,
					top: y + bob,
					transform: `scale(${scale * scaleAnimation}) rotate(${rotation}deg)`,
					transformOrigin: 'center',
					opacity,
					filter: 'drop-shadow(2px 2px 8px rgba(0,0,0,0.2))',
				}}
			>
				{/* Apple SVG */}
				<svg
					width={60 * scale}
					height={60 * scale}
					viewBox="0 0 60 60"
				>
					{/* Apple body */}
					<path
						d="M 30 10 C 20 10, 10 20, 10 35 C 10 50, 20 55, 30 55 C 40 55, 50 50, 50 35 C 50 20, 40 10, 30 10"
						fill="#dc143c"
						stroke="#8b0000"
						strokeWidth="1"
					/>

					{/* Apple dent/indent */}
					<path
						d="M 25 12 C 25 15, 28 18, 30 18 C 32 18, 35 15, 35 12"
						fill="#8b0000"
					/>

					{/* Apple stem */}
					<rect
						x="29"
						y="8"
						width="2"
						height="8"
						fill="#8b4513"
						rx="1"
					/>

					{/* Apple leaf */}
					<ellipse
						cx="34"
						cy="12"
						rx="4"
						ry="2"
						fill="#228b22"
						transform="rotate(30 34 12)"
					/>

					{/* Apple shine */}
					<ellipse
						cx="22"
						cy="25"
						rx="4"
						ry="8"
						fill="#ff6b6b"
						opacity="0.6"
						transform="rotate(-20 22 25)"
					/>

					{/* Small highlight */}
					<circle
						cx="20"
						cy="22"
						r="2"
						fill="#fff"
						opacity="0.8"
					/>
				</svg>

				{/* Physics trail effect */}
				{floatDirection === 'up' && (
					<div
						style={{
							position: 'absolute',
							left: '50%',
							top: '100%',
							width: '2px',
							height: '20px',
							background: 'linear-gradient(to bottom, rgba(220, 20, 60, 0.6), transparent)',
							transform: 'translateX(-50%)',
						}}
					/>
				)}
			</div>
		</AbsoluteFill>
	);
};

interface MultipleApplesProps {
	count?: number;
	startTime?: number;
	floatDirection?: 'up' | 'down';
	spread?: number;
}

export const MultipleApples: React.FC<MultipleApplesProps> = ({
	count = 5,
	startTime = 0,
	floatDirection = 'up',
	spread = 200,
}) => {
	const {width, height} = useVideoConfig();

	return (
		<AbsoluteFill>
			{Array.from({length: count}, (_, index) => {
				const seedValue = `apple-${index}`;
				const randomX = random(seedValue + 'x');
				const randomY = random(seedValue + 'y');
				const randomDelay = random(seedValue + 'delay');
				const randomScale = random(seedValue + 'scale');
				const randomSpeed = random(seedValue + 'speed');

				return (
					<Apple
						key={index}
						startX={width * 0.2 + randomX * spread}
						startY={height * 0.8 + randomY * 100}
						floatDirection={floatDirection}
						delay={startTime + randomDelay * 60} // Up to 2 seconds stagger
						scale={0.8 + randomScale * 0.4} // 0.8 to 1.2 scale
						rotationSpeed={0.5 + randomSpeed * 1.5} // 0.5 to 2.0 speed
						seed={seedValue}
					/>
				);
			})}
		</AbsoluteFill>
	);
};