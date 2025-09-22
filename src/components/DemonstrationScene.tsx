import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {Scientist} from './Scientist';
import {MultipleApples} from './Apple';

export const DemonstrationScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();

	// Scene progression (10 seconds = 300 frames)
	const phases = {
		setup: {start: 0, end: 60}, // 2 seconds - scientist sets up experiment
		experiment: {start: 60, end: 180}, // 4 seconds - multiple apples float
		explanation: {start: 180, end: 240}, // 2 seconds - scientist explains
		conclusion: {start: 240, end: 300}, // 2 seconds - wrap up demonstration
	};

	const getCurrentPhase = () => {
		if (frame <= phases.setup.end) return 'setup';
		if (frame <= phases.experiment.end) return 'experiment';
		if (frame <= phases.explanation.end) return 'explanation';
		return 'conclusion';
	};

	const currentPhase = getCurrentPhase();

	// Title animation
	const titleOpacity = interpolate(
		frame,
		[0, 30, 270, 300],
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

	// Scientist animation and position
	const getScientistAnimation = () => {
		switch (currentPhase) {
			case 'setup':
				return 'thoughtful';
			case 'experiment':
				return 'pointing';
			case 'explanation':
				return 'excited';
			case 'conclusion':
				return 'excited';
			default:
				return 'idle';
		}
	};

	// Equipment panel animation
	const equipmentScale = spring({
		fps,
		frame: Math.max(0, frame - phases.setup.start),
		config: {
			damping: 200,
			stiffness: 150,
		},
	});

	// Text content based on phase
	const getPhaseText = () => {
		switch (currentPhase) {
			case 'setup':
				return 'Dr. Priya prepares her experiment...';
			case 'experiment':
				return 'Activating the reverse gravity field!';
			case 'explanation':
				return 'The field inverts gravitational force direction!';
			case 'conclusion':
				return 'Science reveals the impossible!';
			default:
				return '';
		}
	};

	const textOpacity = interpolate(
		frame % 80,
		[0, 20, 60, 80],
		[0, 1, 1, 0],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	// Energy field effect
	const fieldIntensity = interpolate(
		Math.sin(frame * 0.1),
		[-1, 1],
		[0.3, 1],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const showEnergyField = currentPhase === 'experiment' || currentPhase === 'explanation';

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
					The Demonstration
				</h1>
			</div>

			{/* Energy Field Effect */}
			{showEnergyField && (
				<div
					style={{
						position: 'absolute',
						left: width * 0.2,
						top: height * 0.3,
						width: width * 0.6,
						height: height * 0.4,
						background: `radial-gradient(ellipse,
							rgba(138, 43, 226, ${0.2 * fieldIntensity}) 0%,
							rgba(75, 0, 130, ${0.1 * fieldIntensity}) 50%,
							transparent 100%)`,
						borderRadius: '50%',
						animation: 'pulse 2s ease-in-out infinite',
					}}
				/>
			)}

			{/* Scientific Equipment Panel */}
			<div
				style={{
					position: 'absolute',
					left: width * 0.05,
					top: height * 0.25,
					transform: `scale(${equipmentScale})`,
					transformOrigin: 'top left',
				}}
			>
				<svg width="200" height="300" viewBox="0 0 200 300">
					{/* Control Panel */}
					<rect
						x="10"
						y="10"
						width="180"
						height="280"
						fill="#2c3e50"
						stroke="#34495e"
						strokeWidth="3"
						rx="10"
						filter="drop-shadow(4px 4px 8px rgba(0,0,0,0.3))"
					/>

					{/* Screen */}
					<rect
						x="30"
						y="30"
						width="140"
						height="80"
						fill="#000"
						rx="5"
					/>

					{/* Screen content */}
					<text x="100" y="55" fontSize="12" fill="#00ff00" textAnchor="middle">
						GRAVITY FIELD
					</text>
					<text x="100" y="75" fontSize="10" fill="#00ff00" textAnchor="middle">
						STATUS: {currentPhase === 'experiment' ? 'ACTIVE' : 'STANDBY'}
					</text>
					<text x="100" y="90" fontSize="8" fill="#00ff00" textAnchor="middle">
						INTENSITY: {Math.round(fieldIntensity * 100)}%
					</text>

					{/* Buttons */}
					<circle cx="50" cy="140" r="12" fill={currentPhase === 'experiment' ? '#e74c3c' : '#7f8c8d'} />
					<circle cx="100" cy="140" r="12" fill="#f39c12" />
					<circle cx="150" cy="140" r="12" fill="#27ae60" />

					{/* Dials */}
					<circle cx="60" cy="180" r="20" fill="#34495e" stroke="#95a5a6" strokeWidth="2" />
					<circle cx="140" cy="180" r="20" fill="#34495e" stroke="#95a5a6" strokeWidth="2" />

					{/* Indicator lights */}
					{Array.from({length: 6}, (_, i) => (
						<circle
							key={i}
							cx={40 + i * 20}
							cy="230"
							r="4"
							fill={i < Math.floor(fieldIntensity * 6) ? '#e74c3c' : '#7f8c8d'}
						/>
					))}

					{/* Warning label */}
					<text x="100" y="260" fontSize="8" fill="#e74c3c" textAnchor="middle">
						⚠ EXPERIMENTAL DEVICE ⚠
					</text>
				</svg>
			</div>

			{/* Scientist Character */}
			<Scientist
				position="right"
				animation={getScientistAnimation()}
				scale={1.1}
			/>

			{/* Multiple Floating Apples */}
			{currentPhase === 'experiment' && (
				<MultipleApples
					count={8}
					startTime={phases.experiment.start - frame}
					floatDirection="up"
					spread={300}
				/>
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

			{/* Scientific formulas overlay */}
			{currentPhase === 'explanation' && (
				<ScientificFormulas frame={frame - phases.explanation.start} />
			)}

			{/* Energy waves */}
			{showEnergyField && (
				<EnergyWaves frame={frame} intensity={fieldIntensity} />
			)}
		</AbsoluteFill>
	);
};

interface ScientificFormulasProps {
	frame: number;
}

const ScientificFormulas: React.FC<ScientificFormulasProps> = ({frame}) => {
	const {width, height} = useVideoConfig();

	const formulas = [
		'F = -mg ↑',
		'g = -9.8 m/s²',
		'E = mc²',
		'∇·E = ρ/ε₀'
	];

	return (
		<div style={{position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none'}}>
			{formulas.map((formula, index) => {
				const opacity = interpolate(
					frame,
					[index * 15, index * 15 + 30, 45, 60],
					[0, 1, 1, 0],
					{
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					}
				);

				const y = interpolate(
					frame,
					[index * 15, index * 15 + 30],
					[height * (0.3 + index * 0.1) + 20, height * (0.3 + index * 0.1)],
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
							right: width * 0.1,
							top: y,
							opacity,
							color: '#8e44ad',
							fontSize: '24px',
							fontWeight: 'bold',
							textShadow: '1px 1px 2px rgba(255,255,255,0.8)',
						}}
					>
						{formula}
					</div>
				);
			})}
		</div>
	);
};

interface EnergyWavesProps {
	frame: number;
	intensity: number;
}

const EnergyWaves: React.FC<EnergyWavesProps> = ({frame, intensity}) => {
	const {width, height} = useVideoConfig();

	return (
		<div style={{position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none'}}>
			{Array.from({length: 3}, (_, index) => {
				const waveRadius = interpolate(
					(frame + index * 20) % 60,
					[0, 60],
					[50, 300],
					{
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					}
				);

				const waveOpacity = interpolate(
					(frame + index * 20) % 60,
					[0, 20, 40, 60],
					[0, intensity * 0.6, intensity * 0.3, 0],
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
							left: width * 0.5,
							top: height * 0.5,
							width: waveRadius * 2,
							height: waveRadius * 2,
							transform: 'translate(-50%, -50%)',
							border: `2px solid rgba(138, 43, 226, ${waveOpacity})`,
							borderRadius: '50%',
							pointerEvents: 'none',
						}}
					/>
				);
			})}
		</div>
	);
};