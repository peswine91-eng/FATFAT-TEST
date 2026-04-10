import React from 'react';
import {Composition} from 'remotion';
import {HelloWorld} from './HelloWorld';

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
		</>
	);
};
