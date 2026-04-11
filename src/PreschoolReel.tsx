import React from 'react';
import {
	AbsoluteFill,
	Img,
	interpolate,
	random,
	Sequence,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

/**
 * Vertical Instagram Reel (1080x1920 @ 30fps).
 * "POV: my day at a Singapore preschool" — targeted at parents.
 *
 * Storyboard (total 540 frames ≈ 18s):
 *   0- 60   Hook card    "POV: my day at preschool"
 *  60-180   Scene 1 img  "Morning circle time with my friends"
 * 180-240   Suspense     "Guess what teacher brought today?"
 * 240-390   Scene 2 img  "FRESH WATERMELON! 🍉"
 * 390-480   Fact card    "Learning through play, every day"
 * 480-540   CTA          "Follow for more SG preschool moments"
 */

export const REEL_DURATION = 540;
export const REEL_FPS = 30;
export const REEL_WIDTH = 1080;
export const REEL_HEIGHT = 1920;

const PINK = '#ff6ec7';
const PURPLE = '#8a5cff';
const CYAN = '#4ad6ff';
const YELLOW = '#ffd23f';

export const PreschoolReel: React.FC = () => {
	return (
		<AbsoluteFill style={{background: '#1a1040', overflow: 'hidden'}}>
			<AnimatedGradient />
			<FloatingEmojis />

			<Sequence durationInFrames={60}>
				<HookCard />
			</Sequence>

			<Sequence from={60} durationInFrames={120}>
				<PhotoScene
					src={staticFile('scene1.jpg')}
					caption="Morning circle time ☀️"
					subCaption="with my besties"
					accent={PINK}
				/>
			</Sequence>

			<Sequence from={180} durationInFrames={60}>
				<SuspenseCard />
			</Sequence>

			<Sequence from={240} durationInFrames={150}>
				<PhotoScene
					src={staticFile('scene2.jpg')}
					caption="FRESH WATERMELON 🍉"
					subCaption="straight from the market!"
					accent={YELLOW}
				/>
			</Sequence>

			<Sequence from={390} durationInFrames={90}>
				<FactCard />
			</Sequence>

			<Sequence from={480} durationInFrames={60}>
				<CTACard />
			</Sequence>

			<ProgressBar />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ */
/*  Backgrounds & decoration                                          */
/* ------------------------------------------------------------------ */

const AnimatedGradient: React.FC = () => {
	const frame = useCurrentFrame();

	const hueA = interpolate(frame, [0, REEL_DURATION], [280, 340], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const hueB = interpolate(frame, [0, REEL_DURATION], [200, 260], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				background: `linear-gradient(160deg, hsl(${hueA}, 80%, 25%) 0%, hsl(${hueB}, 70%, 15%) 100%)`,
			}}
		/>
	);
};

const EMOJI_COUNT = 18;
const EMOJIS = ['✨', '⭐', '💖', '🌸', '🎀', '🍉', '☀️', '🌈'];

const FloatingEmojis: React.FC = () => {
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();

	const items = new Array(EMOJI_COUNT).fill(0).map((_, i) => {
		const x = random(`fx-${i}`) * width;
		const startY = height + 80 + random(`fy-${i}`) * 200;
		const speed = 0.7 + random(`fs-${i}`) * 1.3;
		const drift = Math.sin(frame / 25 + random(`fd-${i}`) * 10) * 30;
		const y = startY - frame * speed;
		const size = 40 + random(`fsz-${i}`) * 40;
		const emoji =
			EMOJIS[Math.floor(random(`fe-${i}`) * EMOJIS.length)];
		const opacity = 0.35 + random(`fo-${i}`) * 0.4;

		return {x: x + drift, y, size, emoji, opacity, key: `fem-${i}`};
	});

	return (
		<AbsoluteFill>
			{items.map((it) => (
				<div
					key={it.key}
					style={{
						position: 'absolute',
						left: it.x,
						top: it.y,
						fontSize: it.size,
						opacity: it.opacity,
						filter: 'drop-shadow(0 4px 20px rgba(255,255,255,0.3))',
					}}
				>
					{it.emoji}
				</div>
			))}
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ */
/*  Cards                                                             */
/* ------------------------------------------------------------------ */

const HookCard: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const pop = spring({
		fps,
		frame,
		config: {damping: 9, stiffness: 140, mass: 0.9},
	});
	const scale = interpolate(pop, [0, 1], [0.4, 1]);
	const rotate = interpolate(pop, [0, 1], [-8, 0]);

	const wobble = Math.sin(frame / 6) * 2;

	const exitOpacity = interpolate(frame, [45, 60], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'center',
				alignItems: 'center',
				opacity: exitOpacity,
			}}
		>
			<div
				style={{
					background: 'white',
					borderRadius: 40,
					padding: '60px 80px',
					transform: `scale(${scale}) rotate(${rotate + wobble}deg)`,
					boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
					border: `8px solid ${PINK}`,
					textAlign: 'center',
				}}
			>
				<div
					style={{
						fontSize: 72,
						fontWeight: 900,
						color: PURPLE,
						fontFamily: 'system-ui, -apple-system, sans-serif',
						letterSpacing: -2,
						lineHeight: 1,
					}}
				>
					POV:
				</div>
				<div
					style={{
						fontSize: 60,
						fontWeight: 800,
						color: '#1a1040',
						fontFamily: 'system-ui, -apple-system, sans-serif',
						marginTop: 16,
						lineHeight: 1.1,
					}}
				>
					my day at
					<br />
					preschool 🎒
				</div>
				<div
					style={{
						fontSize: 36,
						marginTop: 24,
						color: PINK,
						fontWeight: 700,
					}}
				>
					🇸🇬 Singapore
				</div>
			</div>
		</AbsoluteFill>
	);
};

const SuspenseCard: React.FC = () => {
	const frame = useCurrentFrame();

	const slideIn = interpolate(frame, [0, 15], [120, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const slideOut = interpolate(frame, [45, 60], [0, -120], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const pulse = 1 + Math.sin(frame / 4) * 0.03;

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'center',
				alignItems: 'center',
				transform: `translateY(${slideIn + slideOut}px)`,
			}}
		>
			<div
				style={{
					background: 'white',
					borderRadius: 32,
					padding: '50px 70px',
					boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
					border: `6px solid ${YELLOW}`,
					transform: `scale(${pulse})`,
					textAlign: 'center',
				}}
			>
				<div
					style={{
						fontSize: 56,
						fontWeight: 900,
						color: '#1a1040',
						fontFamily: 'system-ui, -apple-system, sans-serif',
						lineHeight: 1.1,
					}}
				>
					Guess what
					<br />
					Teacher brought
					<br />
					today?? 👀
				</div>
			</div>
		</AbsoluteFill>
	);
};

const FactCard: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const pop = spring({
		fps,
		frame,
		config: {damping: 12, stiffness: 120},
	});
	const scale = interpolate(pop, [0, 1], [0.6, 1]);

	const exitOpacity = interpolate(frame, [75, 90], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'center',
				alignItems: 'center',
				opacity: exitOpacity,
			}}
		>
			<div
				style={{
					background: `linear-gradient(135deg, ${PINK} 0%, ${PURPLE} 100%)`,
					borderRadius: 36,
					padding: '60px 70px',
					transform: `scale(${scale})`,
					boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
					textAlign: 'center',
					maxWidth: 900,
				}}
			>
				<div
					style={{
						fontSize: 48,
						fontWeight: 800,
						color: 'white',
						fontFamily: 'system-ui, -apple-system, sans-serif',
						lineHeight: 1.2,
					}}
				>
					Learning through
					<br />
					<span style={{color: YELLOW}}>play</span>, every
					<br />
					single day 🌱
				</div>
				<div
					style={{
						fontSize: 28,
						color: 'rgba(255,255,255,0.9)',
						marginTop: 24,
						fontWeight: 600,
					}}
				>
					Healthy snacks · real friendships · tiny humans growing big
				</div>
			</div>
		</AbsoluteFill>
	);
};

const CTACard: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const pop = spring({
		fps,
		frame,
		config: {damping: 10, stiffness: 150},
	});
	const scale = interpolate(pop, [0, 1], [0.5, 1]);
	const heartBeat = 1 + Math.sin(frame / 5) * 0.08;

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<div
				style={{
					background: 'white',
					borderRadius: 40,
					padding: '70px 80px',
					transform: `scale(${scale})`,
					boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
					border: `8px solid ${CYAN}`,
					textAlign: 'center',
				}}
			>
				<div style={{fontSize: 100, transform: `scale(${heartBeat})`}}>
					❤️
				</div>
				<div
					style={{
						fontSize: 54,
						fontWeight: 900,
						color: '#1a1040',
						fontFamily: 'system-ui, -apple-system, sans-serif',
						marginTop: 16,
						lineHeight: 1.1,
					}}
				>
					Follow for more
					<br />
					SG preschool
					<br />
					moments!
				</div>
				<div
					style={{
						fontSize: 32,
						color: PURPLE,
						marginTop: 24,
						fontWeight: 700,
					}}
				>
					#SGParents #PreschoolLife
				</div>
			</div>
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ */
/*  Photo scenes                                                       */
/* ------------------------------------------------------------------ */

type PhotoSceneProps = {
	src: string;
	caption: string;
	subCaption: string;
	accent: string;
};

const PhotoScene: React.FC<PhotoSceneProps> = ({
	src,
	caption,
	subCaption,
	accent,
}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	// Ken Burns: slow zoom across the scene
	const zoom = interpolate(frame, [0, durationInFrames], [1.0, 1.18], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const drift = interpolate(frame, [0, durationInFrames], [-20, 20], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Entry
	const enterScale = spring({
		fps,
		frame,
		config: {damping: 14, stiffness: 110},
	});
	const entry = interpolate(enterScale, [0, 1], [0.85, 1]);
	const entryOpacity = interpolate(frame, [0, 12], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Exit
	const exitOpacity = interpolate(
		frame,
		[durationInFrames - 12, durationInFrames],
		[1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);

	return (
		<AbsoluteFill style={{opacity: entryOpacity * exitOpacity}}>
			{/* Full-bleed blurred background using the same photo */}
			<AbsoluteFill>
				<Img
					src={src}
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
						filter: 'blur(40px) brightness(0.5) saturate(1.4)',
						transform: `scale(${1.25})`,
					}}
				/>
			</AbsoluteFill>

			{/* Centered image card */}
			<AbsoluteFill
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					padding: '220px 60px 380px 60px',
				}}
			>
				<div
					style={{
						position: 'relative',
						width: '100%',
						maxWidth: 960,
						borderRadius: 36,
						overflow: 'hidden',
						boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
						border: `10px solid white`,
						transform: `scale(${entry})`,
						aspectRatio: '4 / 3',
					}}
				>
					<Img
						src={src}
						style={{
							width: '100%',
							height: '100%',
							objectFit: 'cover',
							transform: `scale(${zoom}) translateX(${drift}px)`,
							transformOrigin: 'center center',
						}}
					/>
					{/* Bottom gradient for subtitle legibility */}
					<div
						style={{
							position: 'absolute',
							left: 0,
							right: 0,
							bottom: 0,
							height: '40%',
							background:
								'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
						}}
					/>
				</div>
			</AbsoluteFill>

			<AnimatedCaption
				text={caption}
				subText={subCaption}
				accent={accent}
			/>
		</AbsoluteFill>
	);
};

const AnimatedCaption: React.FC<{
	text: string;
	subText: string;
	accent: string;
}> = ({text, subText, accent}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const pop = spring({
		fps,
		frame: Math.max(0, frame - 8),
		config: {damping: 11, stiffness: 130},
	});
	const scale = interpolate(pop, [0, 1], [0.7, 1]);
	const translateY = interpolate(pop, [0, 1], [60, 0]);

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'flex-end',
				alignItems: 'center',
				paddingBottom: 200,
			}}
		>
			<div
				style={{
					transform: `translateY(${translateY}px) scale(${scale})`,
					textAlign: 'center',
				}}
			>
				<div
					style={{
						display: 'inline-block',
						background: 'white',
						color: '#1a1040',
						fontFamily: 'system-ui, -apple-system, sans-serif',
						fontSize: 64,
						fontWeight: 900,
						padding: '22px 40px',
						borderRadius: 24,
						boxShadow: `0 20px 60px rgba(0,0,0,0.5)`,
						border: `6px solid ${accent}`,
						letterSpacing: -1,
						lineHeight: 1.1,
					}}
				>
					{text}
				</div>
				<div
					style={{
						marginTop: 20,
						display: 'inline-block',
						background: accent,
						color: 'white',
						fontFamily: 'system-ui, -apple-system, sans-serif',
						fontSize: 38,
						fontWeight: 700,
						padding: '14px 32px',
						borderRadius: 18,
						boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
					}}
				>
					{subText}
				</div>
			</div>
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ */
/*  Progress bar                                                      */
/* ------------------------------------------------------------------ */

const ProgressBar: React.FC = () => {
	const frame = useCurrentFrame();
	const {durationInFrames, width} = useVideoConfig();

	const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'flex-start',
				alignItems: 'flex-start',
			}}
		>
			<div
				style={{
					marginTop: 60,
					marginLeft: 40,
					width: width - 80,
					height: 8,
					background: 'rgba(255,255,255,0.2)',
					borderRadius: 4,
					overflow: 'hidden',
				}}
			>
				<div
					style={{
						width: `${progress * 100}%`,
						height: '100%',
						background: `linear-gradient(90deg, ${PINK}, ${PURPLE}, ${CYAN})`,
						borderRadius: 4,
					}}
				/>
			</div>
		</AbsoluteFill>
	);
};
