import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	random,
	Sequence,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

type HelloWorldProps = {
	titleText: string;
	subtitleText: string;
};

export const HelloWorld: React.FC<HelloWorldProps> = ({
	titleText,
	subtitleText,
}) => {
	const frame = useCurrentFrame();

	// Subtle gradient hue shift across the whole video
	const hue = interpolate(frame, [0, 210], [220, 280], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				background: `linear-gradient(135deg, hsl(${hue}, 70%, 20%) 0%, hsl(${
					hue + 40
				}, 60%, 10%) 100%)`,
				fontFamily: 'system-ui, -apple-system, sans-serif',
			}}
		>
			{/* Background of twinkling deterministic "stars" */}
			<StarField />

			{/* Title springs in */}
			<Sequence from={10}>
				<Title text={titleText} />
			</Sequence>

			{/* Subtitle fades in after the title lands */}
			<Sequence from={45}>
				<Subtitle text={subtitleText} />
			</Sequence>

			{/* A pulsing accent bar at the bottom after the text is in */}
			<Sequence from={80}>
				<AccentBar />
			</Sequence>
		</AbsoluteFill>
	);
};

const Title: React.FC<{text: string}> = ({text}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const scale = spring({
		fps,
		frame,
		config: {damping: 12, stiffness: 120, mass: 1},
	});

	const translateY = interpolate(scale, [0, 1], [-80, 0]);

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<h1
				style={{
					color: 'white',
					fontSize: 140,
					fontWeight: 800,
					margin: 0,
					letterSpacing: -4,
					transform: `translateY(${translateY}px) scale(${scale})`,
					textShadow: '0 20px 60px rgba(0,0,0,0.5)',
				}}
			>
				{text}
			</h1>
		</AbsoluteFill>
	);
};

const Subtitle: React.FC<{text: string}> = ({text}) => {
	const frame = useCurrentFrame();

	const opacity = interpolate(frame, [0, 20], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const translateY = interpolate(frame, [0, 20], [30, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'center',
				alignItems: 'center',
				paddingTop: 220,
			}}
		>
			<p
				style={{
					color: 'rgba(255,255,255,0.85)',
					fontSize: 52,
					fontWeight: 400,
					margin: 0,
					opacity,
					transform: `translateY(${translateY}px)`,
					letterSpacing: 1,
				}}
			>
				{text}
			</p>
		</AbsoluteFill>
	);
};

const AccentBar: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, width} = useVideoConfig();

	const progress = spring({
		fps,
		frame,
		config: {damping: 200},
	});

	const barWidth = interpolate(progress, [0, 1], [0, width * 0.3]);

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'flex-end',
				alignItems: 'center',
				paddingBottom: 140,
			}}
		>
			<div
				style={{
					width: barWidth,
					height: 8,
					borderRadius: 4,
					background:
						'linear-gradient(90deg, #ff6ec7 0%, #8a5cff 50%, #4ad6ff 100%)',
					boxShadow: '0 0 40px rgba(138,92,255,0.6)',
				}}
			/>
		</AbsoluteFill>
	);
};

const STAR_COUNT = 60;

const StarField: React.FC = () => {
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();

	// Build a deterministic list of stars using seeded random()
	const stars = new Array(STAR_COUNT).fill(0).map((_, i) => {
		const x = random(`star-x-${i}`) * width;
		const y = random(`star-y-${i}`) * height;
		const size = 2 + random(`star-size-${i}`) * 4;
		const phase = random(`star-phase-${i}`) * Math.PI * 2;

		// Each star twinkles on its own phase
		const twinkle =
			0.3 + 0.7 * (0.5 + 0.5 * Math.sin(frame / 10 + phase));

		return {x, y, size, twinkle, key: `star-${i}`};
	});

	return (
		<AbsoluteFill>
			{stars.map((s) => (
				<div
					key={s.key}
					style={{
						position: 'absolute',
						left: s.x,
						top: s.y,
						width: s.size,
						height: s.size,
						borderRadius: '50%',
						background: 'white',
						opacity: s.twinkle,
						boxShadow: `0 0 ${s.size * 3}px rgba(255,255,255,${s.twinkle})`,
					}}
				/>
			))}
		</AbsoluteFill>
	);
};
