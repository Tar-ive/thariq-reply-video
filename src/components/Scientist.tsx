import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

interface ScientistProps {
	position?: 'left' | 'center' | 'right';
	animation?: 'idle' | 'excited' | 'thoughtful' | 'pointing';
	scale?: number;
}

export const Scientist: React.FC<ScientistProps> = ({
	position = 'center',
	animation = 'idle',
	scale = 1,
}) => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();

	// Position calculations
	const positions = {
		left: width * 0.2,
		center: width * 0.5,
		right: width * 0.8,
	};

	const x = positions[position];
	const y = height * 0.6; // Place scientist in lower portion

	// Animation calculations
	const bounce = spring({
		fps,
		frame,
		config: {
			damping: 200,
			stiffness: 100,
		},
	});

	const excitedBounce = interpolate(
		frame % 60,
		[0, 30, 60],
		[0, -10, 0],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const thoughtfulSway = Math.sin(frame * 0.05) * 5;

	const animationOffset = {
		idle: Math.sin(frame * 0.02) * 2,
		excited: excitedBounce,
		thoughtful: thoughtfulSway,
		pointing: 0,
	}[animation];

	// Arm positions for pointing
	const armRotation = animation === 'pointing'
		? interpolate(frame, [0, 30], [0, -45], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		})
		: 0;

	return (
		<AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					left: x - 60 * scale,
					top: y + animationOffset,
					transform: `scale(${scale * bounce})`,
					transformOrigin: 'center bottom',
				}}
			>
				{/* Scientist Character - SVG representation */}
				<svg
					width={120 * scale}
					height={200 * scale}
					viewBox="0 0 120 200"
					style={{
						filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))',
					}}
				>
					{/* Lab Coat */}
					<rect
						x="25"
						y="70"
						width="70"
						height="120"
						fill="#ffffff"
						stroke="#e0e0e0"
						strokeWidth="2"
						rx="10"
					/>

					{/* Body */}
					<ellipse
						cx="60"
						cy="80"
						rx="20"
						ry="25"
						fill="#8b4513"
					/>

					{/* Head */}
					<circle
						cx="60"
						cy="40"
						r="25"
						fill="#d2b48c"
					/>

					{/* Hair */}
					<path
						d="M 35 25 Q 60 10 85 25 Q 85 45 75 50 Q 60 55 45 50 Q 35 45 35 25"
						fill="#2c1810"
					/>

					{/* Eyes */}
					<circle cx="52" cy="38" r="3" fill="#000" />
					<circle cx="68" cy="38" r="3" fill="#000" />
					<circle cx="53" cy="37" r="1" fill="#fff" />
					<circle cx="69" cy="37" r="1" fill="#fff" />

					{/* Nose */}
					<ellipse cx="60" cy="43" rx="2" ry="3" fill="#c19a6b" />

					{/* Mouth */}
					<path
						d="M 55 48 Q 60 52 65 48"
						stroke="#8b4513"
						strokeWidth="2"
						fill="none"
						strokeLinecap="round"
					/>

					{/* Arms */}
					<ellipse
						cx="35"
						cy="85"
						rx="8"
						ry="25"
						fill="#d2b48c"
						transform={`rotate(${armRotation} 35 85)`}
					/>
					<ellipse
						cx="85"
						cy="85"
						rx="8"
						ry="25"
						fill="#d2b48c"
					/>

					{/* Hands */}
					<circle
						cx="35"
						cy="105"
						r="6"
						fill="#d2b48c"
						transform={`rotate(${armRotation} 35 85)`}
					/>
					<circle cx="85" cy="105" r="6" fill="#d2b48c" />

					{/* Lab Coat Details */}
					<line x1="60" y1="70" x2="60" y2="180" stroke="#d0d0d0" strokeWidth="1" />
					<circle cx="50" cy="90" r="2" fill="#c0c0c0" />
					<circle cx="50" cy="110" r="2" fill="#c0c0c0" />
					<circle cx="50" cy="130" r="2" fill="#c0c0c0" />

					{/* Lab Badge */}
					<rect x="70" y="85" width="15" height="10" fill="#4169e1" rx="2" />
					<text x="77.5" y="92" fontSize="6" fill="white" textAnchor="middle">Dr</text>

					{/* Legs */}
					<rect x="45" y="170" width="12" height="25" fill="#000080" />
					<rect x="63" y="170" width="12" height="25" fill="#000080" />

					{/* Shoes */}
					<ellipse cx="51" cy="192" rx="8" ry="4" fill="#000" />
					<ellipse cx="69" cy="192" rx="8" ry="4" fill="#000" />
				</svg>

				{/* Facial expressions overlay */}
				{animation === 'excited' && (
					<div
						style={{
							position: 'absolute',
							top: '15%',
							left: '50%',
							transform: 'translateX(-50%)',
							fontSize: '24px',
						}}
					>
						✨
					</div>
				)}

				{animation === 'thoughtful' && (
					<div
						style={{
							position: 'absolute',
							top: '10%',
							right: '10%',
							fontSize: '20px',
							animation: 'float 2s ease-in-out infinite',
						}}
					>
						💭
					</div>
				)}
			</div>
		</AbsoluteFill>
	);
};