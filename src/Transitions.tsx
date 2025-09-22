import {interpolate, spring, useVideoConfig} from 'remotion';

interface TransitionsProps {
	frame: number;
	clipDuration: number;
	totalClips: number;
}

export const Transitions: React.FC<TransitionsProps> = ({
	frame,
	clipDuration,
	totalClips
}) => {
	const {fps} = useVideoConfig();

	// Check if we're in a transition zone (last 30 frames of each clip)
	const transitionDuration = 30;
	const clipPosition = frame % clipDuration;
	const isTransitioning = clipPosition >= (clipDuration - transitionDuration);
	const currentClip = Math.floor(frame / clipDuration);
	const isLastClip = currentClip >= totalClips - 1;

	if (!isTransitioning || isLastClip) {
		return null;
	}

	// Calculate transition progress (0 to 1)
	const transitionStart = clipDuration - transitionDuration;
	const progress = interpolate(
		clipPosition,
		[transitionStart, clipDuration - 1],
		[0, 1],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	// Spring animation for smooth transitions
	const springProgress = spring({
		frame: clipPosition - transitionStart,
		fps,
		config: {
			damping: 200,
			stiffness: 100,
		},
	});

	// Fade transition overlay
	const opacity = interpolate(springProgress, [0, 1], [0, 0.8]);

	// Slide transition effect
	const slideX = interpolate(springProgress, [0, 1], [-100, 0]);

	return (
		<>
			{/* Fade overlay */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					backgroundColor: 'rgba(0, 0, 0, 0.3)',
					opacity,
					zIndex: 10,
				}}
			/>

			{/* Slide effect */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: `${slideX}%`,
					width: '100%',
					height: '100%',
					background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
					zIndex: 11,
				}}
			/>

			{/* Transition indicator */}
			<div
				style={{
					position: 'absolute',
					bottom: 20,
					right: 20,
					padding: '8px 16px',
					backgroundColor: 'rgba(255, 255, 255, 0.1)',
					borderRadius: 20,
					fontSize: 14,
					color: 'white',
					fontFamily: 'Arial, sans-serif',
					opacity: springProgress,
					zIndex: 12,
				}}
			>
				Transitioning to {currentClip === 0 ? 'Main' : 'Outro'} Section...
			</div>
		</>
	);
};