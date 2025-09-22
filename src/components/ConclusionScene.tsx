import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {Scientist} from './Scientist';
import {Apple} from './Apple';

export const ConclusionScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();

	// Scene progression (6 seconds = 180 frames)
	const phases = {
		summary: {start: 0, end: 60}, // 2 seconds - scientist summarizes
		impact: {start: 60, end: 120}, // 2 seconds - shows impact
		future: {start: 120, end: 180}, // 2 seconds - future possibilities
	};

	const getCurrentPhase = () => {
		if (frame <= phases.summary.end) return 'summary';
		if (frame <= phases.impact.end) return 'impact';
		return 'future';
	};

	const currentPhase = getCurrentPhase();

	// Title animation
	const titleOpacity = interpolate(
		frame,
		[0, 30, 150, 180],
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

	// Scientist animation
	const getScientistAnimation = () => {
		switch (currentPhase) {
			case 'summary':
				return 'excited';
			case 'impact':
				return 'pointing';
			case 'future':
				return 'excited';
			default:
				return 'excited';
		}
	};

	// Text content based on phase
	const getPhaseText = () => {
		switch (currentPhase) {
			case 'summary':
				return 'We\'ve discovered how to reverse gravity!';
			case 'impact':
				return 'This could revolutionize transportation!';
			case 'future':
				return 'The future of physics starts today!';
			default:
				return '';
		}
	};

	const textOpacity = interpolate(
		frame % 70,
		[0, 20, 50, 70],
		[0, 1, 1, 0],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	// Celebration animation
	const celebrationScale = spring({
		fps,
		frame,
		config: {
			damping: 200,
			stiffness: 100,
		},
	});

	// Achievement badges
	const badgeScale = spring({
		fps,
		frame: Math.max(0, frame - phases.impact.start),
		config: {
			damping: 300,
			stiffness: 200,
		},
	});

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
					Scientific Breakthrough!
				</h1>
			</div>

			{/* Scientist Character */}
			<Scientist
				position="center"
				animation={getScientistAnimation()}
				scale={1.3}
			/>

			{/* Floating Apple (continuous) */}
			<Apple
				startX={width * 0.8}
				startY={height * 0.6}
				floatDirection="up"
				delay={0}
				scale={1.2}
				rotationSpeed={0.5}
				seed="conclusion-apple"
			/>

			{/* Achievement Badges */}
			{currentPhase === 'impact' && (
				<div
					style={{
						position: 'absolute',
						left: width * 0.1,
						top: height * 0.3,
						transform: `scale(${badgeScale})`,
						transformOrigin: 'center',
					}}
				>
					<AchievementBadges frame={frame - phases.impact.start} />
				</div>
			)}

			{/* Scientific Impact Icons */}
			{currentPhase === 'impact' && (
				<ImpactIcons frame={frame - phases.impact.start} />
			)}

			{/* Future Vision */}
			{currentPhase === 'future' && (
				<FutureVision frame={frame - phases.future.start} />
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
						fontSize: '36px',
						color: '#2c3e50',
						fontWeight: 'bold',
						textShadow: '2px 2px 4px rgba(255,255,255,0.8)',
						margin: 0,
						padding: '0 20px',
					}}
				>
					{getPhaseText()}
				</p>
			</div>

			{/* Celebration particles */}
			<CelebrationParticles frame={frame} scale={celebrationScale} />

			{/* Final thank you message */}
			{frame > 150 && (
				<div
					style={{
						position: 'absolute',
						bottom: height * 0.05,
						left: 0,
						right: 0,
						textAlign: 'center',
						opacity: interpolate(frame, [150, 180], [0, 1], {
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
						}),
					}}
				>
					<p
						style={{
							fontSize: '24px',
							color: '#7f8c8d',
							fontStyle: 'italic',
							margin: 0,
						}}
					>
						Thanks for joining this incredible journey!
					</p>
				</div>
			)}
		</AbsoluteFill>
	);
};

interface AchievementBadgesProps {
	frame: number;
}

const AchievementBadges: React.FC<AchievementBadgesProps> = ({frame}) => {
	const achievements = [
		{icon: '🏆', text: 'Physics Pioneer', delay: 0},
		{icon: '🔬', text: 'Scientific Method', delay: 20},
		{icon: '⚗️', text: 'Experimental Success', delay: 40},
	];

	return (
		<div>
			{achievements.map((achievement, index) => {
				const opacity = interpolate(
					frame,
					[achievement.delay, achievement.delay + 20],
					[0, 1],
					{
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					}
				);

				const scale = spring({
					fps: 30,
					frame: Math.max(0, frame - achievement.delay),
					config: {
						damping: 200,
						stiffness: 150,
					},
				});

				return (
					<div
						key={index}
						style={{
							display: 'flex',
							alignItems: 'center',
							marginBottom: '15px',
							opacity,
							transform: `scale(${scale})`,
							background: 'rgba(255,255,255,0.9)',
							padding: '10px 15px',
							borderRadius: '25px',
							border: '2px solid #f39c12',
							boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
						}}
					>
						<span style={{fontSize: '24px', marginRight: '10px'}}>
							{achievement.icon}
						</span>
						<span style={{fontSize: '18px', fontWeight: 'bold', color: '#2c3e50'}}>
							{achievement.text}
						</span>
					</div>
				);
			})}
		</div>
	);
};

interface ImpactIconsProps {
	frame: number;
}

const ImpactIcons: React.FC<ImpactIconsProps> = ({frame}) => {
	const {width, height} = useVideoConfig();

	const impacts = [
		{icon: '🚀', text: 'Space Travel', x: 0.2, y: 0.4},
		{icon: '🏗️', text: 'Construction', x: 0.8, y: 0.35},
		{icon: '🌍', text: 'Environment', x: 0.15, y: 0.55},
		{icon: '⚡', text: 'Energy', x: 0.85, y: 0.5},
	];

	return (
		<>
			{impacts.map((impact, index) => {
				const delay = index * 15;
				const opacity = interpolate(
					frame,
					[delay, delay + 20, 45, 60],
					[0, 1, 1, 0],
					{
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					}
				);

				const y = interpolate(
					frame,
					[delay, delay + 20],
					[height * impact.y + 30, height * impact.y],
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
							left: width * impact.x,
							top: y,
							transform: 'translate(-50%, -50%)',
							opacity,
							textAlign: 'center',
							background: 'rgba(255,255,255,0.9)',
							padding: '8px 12px',
							borderRadius: '15px',
							border: '2px solid #3498db',
							boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
						}}
					>
						<div style={{fontSize: '32px'}}>{impact.icon}</div>
						<div style={{fontSize: '12px', fontWeight: 'bold', color: '#2c3e50'}}>
							{impact.text}
						</div>
					</div>
				);
			})}
		</>
	);
};

interface FutureVisionProps {
	frame: number;
}

const FutureVision: React.FC<FutureVisionProps> = ({frame}) => {
	const {width, height} = useVideoConfig();

	const visionOpacity = interpolate(
		frame,
		[0, 30],
		[0, 0.6],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				top: 0,
				width: '100%',
				height: '100%',
				background: `linear-gradient(45deg,
					rgba(138, 43, 226, ${visionOpacity * 0.3}),
					rgba(75, 0, 130, ${visionOpacity * 0.2}),
					transparent)`,
				pointerEvents: 'none',
			}}
		>
			{/* Future city silhouette */}
			<div
				style={{
					position: 'absolute',
					bottom: '20%',
					left: 0,
					right: 0,
					height: '30%',
					background: `linear-gradient(to top,
						rgba(44, 62, 80, ${visionOpacity}),
						transparent)`,
					clipPath: 'polygon(0 100%, 15% 60%, 25% 80%, 35% 40%, 50% 70%, 65% 30%, 80% 60%, 100% 50%, 100% 100%)',
				}}
			/>

			{/* Flying objects */}
			{Array.from({length: 3}, (_, index) => {
				const x = interpolate(
					frame + index * 20,
					[0, 60],
					[width * -0.1, width * 1.1],
					{
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					}
				);

				const y = height * (0.3 + index * 0.1);

				return (
					<div
						key={index}
						style={{
							position: 'absolute',
							left: x,
							top: y,
							fontSize: '20px',
							opacity: visionOpacity,
						}}
					>
						🚗
					</div>
				);
			})}
		</div>
	);
};

interface CelebrationParticlesProps {
	frame: number;
	scale: number;
}

const CelebrationParticles: React.FC<CelebrationParticlesProps> = ({frame, scale}) => {
	const {width, height} = useVideoConfig();

	return (
		<div style={{position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none'}}>
			{Array.from({length: 20}, (_, index) => {
				const x = interpolate(
					frame + index * 10,
					[0, 120],
					[width * (0.2 + (index % 5) * 0.15), width * (0.3 + (index % 5) * 0.15)],
					{
						extrapolateLeft: 'clamp',
						extrapolateRight: 'extend',
					}
				);

				const y = interpolate(
					frame + index * 15,
					[0, 180],
					[height * 0.9, height * 0.1],
					{
						extrapolateLeft: 'clamp',
						extrapolateRight: 'extend',
					}
				);

				const opacity = interpolate(
					(frame + index * 8) % 90,
					[0, 30, 60, 90],
					[0, 1, 1, 0],
					{
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					}
				);

				const particles = ['🎉', '✨', '🎊', '⭐', '💫'];
				const particle = particles[index % particles.length];

				return (
					<div
						key={index}
						style={{
							position: 'absolute',
							left: x,
							top: y,
							transform: `scale(${scale}) rotate(${frame * 2 + index * 30}deg)`,
							opacity,
							fontSize: '16px',
						}}
					>
						{particle}
					</div>
				);
			})}
		</div>
	);
};