import {
	AbsoluteFill,
	interpolate,
	useVideoConfig,
} from 'remotion';

interface BackgroundProps {
	frame: number;
}

export const Background: React.FC<BackgroundProps> = ({frame}) => {
	const {width, height} = useVideoConfig();

	// Subtle background animation
	const lightIntensity = interpolate(
		Math.sin(frame * 0.01),
		[-1, 1],
		[0.8, 1],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	return (
		<AbsoluteFill>
			{/* Main background gradient */}
			<div
				style={{
					width: '100%',
					height: '100%',
					background: `linear-gradient(135deg,
						#e6f3ff 0%,
						#cce7ff 30%,
						#b3dbff 60%,
						#99cfff 100%)`,
					opacity: lightIntensity,
				}}
			/>

			{/* Laboratory walls */}
			<div
				style={{
					position: 'absolute',
					bottom: 0,
					left: 0,
					right: 0,
					height: '40%',
					background: 'linear-gradient(to top, #f5f5f5, #ffffff)',
					borderTop: '3px solid #e0e0e0',
				}}
			/>

			{/* Laboratory floor */}
			<div
				style={{
					position: 'absolute',
					bottom: 0,
					left: 0,
					right: 0,
					height: '5%',
					background: 'linear-gradient(to bottom, #d0d0d0, #a0a0a0)',
				}}
			/>

			{/* Laboratory equipment - Left side */}
			<LabEquipment side="left" frame={frame} />

			{/* Laboratory equipment - Right side */}
			<LabEquipment side="right" frame={frame} />

			{/* Ceiling lights */}
			<CeilingLights frame={frame} lightIntensity={lightIntensity} />

			{/* Floating particles/dust */}
			<FloatingParticles frame={frame} />
		</AbsoluteFill>
	);
};

interface LabEquipmentProps {
	side: 'left' | 'right';
	frame: number;
}

const LabEquipment: React.FC<LabEquipmentProps> = ({side, frame}) => {
	const {width, height} = useVideoConfig();
	const isLeft = side === 'left';

	// Subtle equipment animation
	const equipmentBob = Math.sin(frame * 0.02) * 2;

	return (
		<div
			style={{
				position: 'absolute',
				[isLeft ? 'left' : 'right']: '5%',
				bottom: '5%',
				transform: `translateY(${equipmentBob}px)`,
			}}
		>
			{/* Laboratory table */}
			<svg width="200" height="150" viewBox="0 0 200 150">
				{/* Table surface */}
				<rect
					x="10"
					y="80"
					width="180"
					height="15"
					fill="#8b4513"
					stroke="#654321"
					strokeWidth="2"
					rx="5"
				/>

				{/* Table legs */}
				<rect x="20" y="95" width="8" height="50" fill="#654321" />
				<rect x="172" y="95" width="8" height="50" fill="#654321" />

				{/* Equipment on table */}
				{isLeft ? (
					<>
						{/* Microscope */}
						<g transform="translate(40, 30)">
							<rect x="0" y="35" width="30" height="45" fill="#2c3e50" rx="5" />
							<circle cx="15" cy="20" r="12" fill="#34495e" />
							<rect x="12" y="5" width="6" height="15" fill="#2c3e50" />
							<circle cx="15" cy="5" r="4" fill="#3498db" />
						</g>

						{/* Beakers */}
						<g transform="translate(90, 45)">
							<rect x="0" y="15" width="20" height="35" fill="rgba(0,150,255,0.3)" rx="3" />
							<rect x="0" y="15" width="20" height="5" fill="#e74c3c" rx="3" />
							<ellipse cx="10" cy="15" rx="10" ry="3" fill="#3498db" />
						</g>
					</>
				) : (
					<>
						{/* Books stack */}
						<g transform="translate(30, 50)">
							<rect x="0" y="20" width="40" height="8" fill="#e74c3c" />
							<rect x="2" y="12" width="38" height="8" fill="#3498db" />
							<rect x="4" y="4" width="36" height="8" fill="#f39c12" />
						</g>

						{/* Flask */}
						<g transform="translate(120, 40)">
							<circle cx="15" cy="25" r="15" fill="rgba(46,204,113,0.4)" />
							<rect x="12" y="10" width="6" height="15" fill="#2c3e50" />
							<ellipse cx="15" cy="25" rx="15" ry="3" fill="#27ae60" />
						</g>
					</>
				)}
			</svg>
		</div>
	);
};

interface CeilingLightsProps {
	frame: number;
	lightIntensity: number;
}

const CeilingLights: React.FC<CeilingLightsProps> = ({frame, lightIntensity}) => {
	const {width} = useVideoConfig();

	return (
		<div style={{position: 'absolute', top: '10%', width: '100%'}}>
			{/* Light fixtures */}
			{[0.2, 0.5, 0.8].map((position, index) => (
				<div
					key={index}
					style={{
						position: 'absolute',
						left: `${position * 100}%`,
						transform: 'translateX(-50%)',
					}}
				>
					{/* Light fixture */}
					<div
						style={{
							width: '60px',
							height: '20px',
							background: '#e0e0e0',
							borderRadius: '30px',
							border: '2px solid #c0c0c0',
							position: 'relative',
						}}
					>
						{/* Light glow */}
						<div
							style={{
								position: 'absolute',
								top: '100%',
								left: '50%',
								transform: 'translateX(-50%)',
								width: '120px',
								height: '200px',
								background: `radial-gradient(ellipse at top,
									rgba(255,255,255,${0.1 * lightIntensity}) 0%,
									transparent 70%)`,
								pointerEvents: 'none',
							}}
						/>
					</div>
				</div>
			))}
		</div>
	);
};

interface FloatingParticlesProps {
	frame: number;
}

const FloatingParticles: React.FC<FloatingParticlesProps> = ({frame}) => {
	const {width, height} = useVideoConfig();

	return (
		<div style={{position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none'}}>
			{Array.from({length: 8}, (_, index) => {
				const x = interpolate(
					frame + index * 30,
					[0, 600],
					[width * 0.1, width * 0.9],
					{
						extrapolateLeft: 'clamp',
						extrapolateRight: 'extend',
					}
				) % width;

				const y = interpolate(
					Math.sin((frame + index * 45) * 0.02),
					[-1, 1],
					[height * 0.2, height * 0.8],
					{
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					}
				);

				const opacity = interpolate(
					Math.sin((frame + index * 60) * 0.03),
					[-1, 1],
					[0.1, 0.4],
					{
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					}
				);

				return (
					<div
						key={index}
						style={{
							position: 'absolute',
							left: x,
							top: y,
							width: '3px',
							height: '3px',
							background: '#ffffff',
							borderRadius: '50%',
							opacity,
						}}
					/>
				);
			})}
		</div>
	);
};