import React from 'react';
import {Composition} from 'remotion';
import {HelloWorld} from './HelloWorld';
import {
	PreschoolReel,
	REEL_DURATION,
	REEL_FPS,
	REEL_HEIGHT,
	REEL_WIDTH,
} from './PreschoolReel';

export const Root: React.FC = () => {
	return (
		<>
			<Composition
				id="HelloWorld"
				component={HelloWorld}
				durationInFrames={210}
				width={1920}
				height={1080}
				fps={30}
				defaultProps={{
					titleText: 'Hello Remotion!',
					subtitleText: 'Videos built with React',
				}}
			/>
			<Composition
				id="PreschoolReel"
				component={PreschoolReel}
				durationInFrames={REEL_DURATION}
				width={REEL_WIDTH}
				height={REEL_HEIGHT}
				fps={REEL_FPS}
				defaultProps={{}}
			/>
		</>
	);
};
