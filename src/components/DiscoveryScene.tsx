import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {Scientist} from './Scientist';
import {Apple} from './Apple';

export const DiscoveryScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();

	// Scene progression (8 seconds = 240 frames)
	const phases = {
		intro: {start: 0, end: 60}, // 2 seconds - scientist appears
		observation: {start: 60, end: 120}, // 2 seconds - scientist observes
		realization: {start: 120, end: 180}, // 2 seconds - scientist realizes
		excitement: {start: 180, end: 240}, // 2 seconds - scientist gets excited
	};

	const getCurrentPhase = () => {
		if (frame <= phases.intro.end) return 'intro';
		if (frame <= phases.observation.end) return 'observation';
		if (frame <= phases.realization.end) return 'realization';
		return 'excitement';
	};

	const currentPhase = getCurrentPhase();

	// Title animation
	const titleOpacity = interpolate(
		frame,
		[0, 30, 210, 240],
		[0, 1, 1, 0],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const titleY = interpolate(
		frame,
		[0, 30],
		[height * 0.1 - 50, height * 0.1],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	// Apple drop animation
	const showApple = frame >= phases.observation.start;
	const appleStartY = height * 0.3;

	// Scientist animation based on phase
	const getScientistAnimation = () => {
		switch (currentPhase) {
			case 'intro':
				return 'idle';
			case 'observation':
				return 'thoughtful';
			case 'realization':
				return 'thoughtful';
			case 'excitement':
				return 'excited';
			default:
				return 'idle';
		}
	};

	// Text content based on phase
	const getPhaseText = () => {
		switch (currentPhase) {
			case 'intro':
				return 'Meet Dr. Priya, a curious physicist...';
			case 'observation':
				return 'She notices something strange...';
			case 'realization':
				return 'Wait... that apple is falling UP?!';
			case 'excitement':
				return 'A discovery that defies gravity!';
			default:
				return '';
		}
	};

	const textOpacity = interpolate(
		frame % 60,
		[0, 15, 45, 60],
		[0, 1, 1, 0],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	// Thought bubble animation
	const thoughtBubbleScale = spring({
		fps,
		frame: Math.max(0, frame - phases.observation.start),
		config: {
			damping: 200,
			stiffness: 100,
		},
	});

	const showThoughtBubble = currentPhase === 'observation' || currentPhase === 'realization';

	return (
		<AbsoluteFill>
			{/* Scene Title */}
			<div
				style={{
					position: 'absolute',
					top: titleY,
					left: 0,
					right: 0,
					textAlign: 'center',
					opacity: titleOpacity,
				}}
			>
				<h1
					style={{
						fontSize: '48px',
						fontWeight: 'bold',
						color: '#2c3e50',
						textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
						margin: 0,
					}}
				>
					The Discovery
				</h1>
			</div>

			{/* Scientist Character */}
			<Scientist
				position="center"
				animation={getScientistAnimation()}
				scale={1.2}
			/>

			{/* Floating Apple */}
			{showApple && (
				<Apple
					startX={width * 0.7}
					startY={appleStartY}
					floatDirection="up"
					delay={0}
					scale={1.5}
					seed="discovery-apple"
				/>
			)}

			{/* Thought Bubble */}
			{showThoughtBubble && (
				<div
					style={{
						position: 'absolute',
						left: width * 0.6,
						top: height * 0.2,
						transform: `scale(${thoughtBubbleScale})`,
						transformOrigin: 'bottom left',
					}}
				>
					<svg width="200" height="120" viewBox="0 0 200 120">
						{/* Thought bubble */}
						<ellipse
							cx="100"
							cy="60"
							rx="80"
							ry="40"
							fill="white"
							stroke="#2c3e50"
							strokeWidth="3"
							filter="drop-shadow(2px 2px 8px rgba(0,0,0,0.2))"
						/>

						{/* Bubble tail */}
						<circle cx="30" cy="90" r="15" fill="white" stroke="#2c3e50" strokeWidth="3" />
						<circle cx="15" cy="105" r="8" fill="white" stroke="#2c3e50" strokeWidth="3" />
						<circle cx="8" cy="115" r="4" fill="white" stroke="#2c3e50" strokeWidth="3" />

						{/* Question marks */}
						<text x="100" y="70" fontSize="36" textAnchor="middle" fill="#2c3e50">?</text>
					</svg>
				</div>
			)}

			{/* Phase Text */}
			<div
				style={{
					position: 'absolute',
					bottom: height * 0.15,
					left: 0,
					right: 0,
					textAlign: 'center',
					opacity: textOpacity,
				}}
			>
				<p
					style={{
						fontSize: '32px',
						color: '#2c3e50',
						fontWeight: '600',
						textShadow: '1px 1px 2px rgba(255,255,255,0.8)',
						margin: 0,
						padding: '0 20px',
					}}
				>
					{getPhaseText()}
				</p>
			</div>

			{/* Excitement particles */}
			{currentPhase === 'excitement' && (
				<ExcitementParticles frame={frame - phases.excitement.start} />
			)}
		</AbsoluteFill>
	);
};

interface ExcitementParticlesProps {
	frame: number;
}

const ExcitementParticles: React.FC<ExcitementParticlesProps> = ({frame}) => {
	const {width, height} = useVideoConfig();

	return (
		<div style={{position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none'}}>
			{Array.from({length: 12}, (_, index) => {
				const angle = (index / 12) * Math.PI * 2;
				const distance = interpolate(
					frame,
					[0, 60],
					[0, 150],
					{
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					}
				);

				const x = width * 0.5 + Math.cos(angle) * distance;
				const y = height * 0.6 + Math.sin(angle) * distance;

				const opacity = interpolate(
					frame,
					[0, 20, 40, 60],
					[0, 1, 1, 0],
					{
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					}
				);

				const rotation = frame * 6 + index * 30;

				return (
					<div
						key={index}
						style={{
							position: 'absolute',
							left: x,
							top: y,
							transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
							opacity,
							fontSize: '24px',
						}}
					>
						✨
					</div>
				);
			})}
		</div>
	);
};