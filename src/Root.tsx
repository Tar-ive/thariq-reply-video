import {Composition} from 'remotion';
import {ThariqReply} from './ThariqReply';
import {ReverseGravityComposition} from './ReverseGravityComposition';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="ThariqReply"
				component={ThariqReply}
				durationInFrames={720} // 24 seconds at 30fps for social media
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
			/>
			<Composition
				id="ReverseGravity"
				component={ReverseGravityComposition}
				durationInFrames={720} // 24 seconds at 30fps
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{}}
			/>
		</>
	);
};