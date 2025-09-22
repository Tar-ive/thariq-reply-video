import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Video} from './Video';
import {Transitions} from './Transitions';

export const VideoComposition: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	// Divide into 3 clips of 300 frames each (10 seconds each)
	const clipDuration = 300;
	const currentClip = Math.floor(frame / clipDuration);
	const clipFrame = frame % clipDuration;

	const clips = [
		{
			id: 'intro',
			startFrame: 0,
			endFrame: 299,
			background: '#1a1a2e',
			theme: 'intro'
		},
		{
			id: 'main',
			startFrame: 300,
			endFrame: 599,
			background: '#16213e',
			theme: 'main'
		},
		{
			id: 'outro',
			startFrame: 600,
			endFrame: 899,
			background: '#0f3460',
			theme: 'outro'
		}
	];

	const activeClip = clips[currentClip] || clips[0];

	return (
		<div
			style={{
				flex: 1,
				backgroundColor: activeClip.background,
				position: 'relative',
				width: '100%',
				height: '100%',
			}}
		>
			{/* Main video content */}
			<Video
				clip={activeClip}
				frame={clipFrame}
				globalFrame={frame}
			/>

			{/* Transitions between clips */}
			<Transitions
				frame={frame}
				clipDuration={clipDuration}
				totalClips={clips.length}
			/>
		</div>
	);
};