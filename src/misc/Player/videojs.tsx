import React from 'react';
import Grid from '@mui/material/GridLegacy';
import { createPlayer, videoFeatures, Poster } from '@videojs/react';
import { VideoSkin } from '@videojs/react/video';
import { HlsVideo } from '@videojs/react/media/hls-video';

import '@videojs/react/video/skin.css';
import './video-js-skin-internal.css';
import './video-js-skin-public.css';

const Player = createPlayer({ features: videoFeatures });

export default function VideoJS(props) {
	const { options, type, logo } = props;

	// In videojs v10, sources is usually passed to the video element src prop
	const src =
		options.sources && options.sources[0] ? options.sources[0].src : '';

	// Also controls, poster, autoplay, muted
	const controls = options.controls;
	const poster = options.poster;
	const autoplay = options.autoplay;
	const muted = options.muted;

	return (
		<Grid
			container
			direction="column"
			spacing={2}
			sx={{ justifyContent: 'center', alignItems: 'center' }}
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				bottom: 0,
				right: 0,
			}}
		>
			<div
				data-vjs-player
				style={{ width: '100%', height: '100%', position: 'relative' }}
			>
				<Player.Provider>
					<Player.Container
						className={
							type === 'videojs-internal'
								? 'media-internal'
								: 'media-public'
						}
					>
						{controls ? (
							<VideoSkin poster={poster}>
								<HlsVideo
									src={src}
									autoPlay={autoplay}
									muted={muted}
									playsInline
								/>
							</VideoSkin>
						) : (
							<>
								<HlsVideo
									src={src}
									autoPlay={autoplay}
									muted={muted}
									playsInline
								/>
								{poster && <Poster src={poster} />}
							</>
						)}
						{/* Render Logo Overlay */}
						{logo && logo.image && (
							<div
								style={{
									position: 'absolute',
									zIndex: 10,
									margin: '15px',
									top: logo.position.includes('top')
										? 0
										: 'auto',
									bottom: logo.position.includes('bottom')
										? '50px'
										: 'auto',
									left: logo.position.includes('left')
										? 0
										: 'auto',
									right: logo.position.includes('right')
										? 0
										: 'auto',
									pointerEvents: logo.link ? 'auto' : 'none',
								}}
							>
								{logo.link ? (
									<a
										href={logo.link}
										target="_blank"
										rel="noopener noreferrer"
									>
										<img
											src={logo.image}
											alt="Logo"
											style={{
												maxHeight: '40px',
												width: 'auto',
											}}
										/>
									</a>
								) : (
									<img
										src={logo.image}
										alt="Logo"
										style={{
											maxHeight: '40px',
											width: 'auto',
										}}
									/>
								)}
							</div>
						)}
					</Player.Container>
				</Player.Provider>
			</div>
		</Grid>
	);
}

VideoJS.defaultProps = {
	type: 'videojs-internal',
};
