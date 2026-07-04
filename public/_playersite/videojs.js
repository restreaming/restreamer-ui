// Video.js v10 playersite init
// playerConfig and helper vars (autoplay, mute, color, chromecast, airplay)
// are defined in the inline script block above this file.

(function () {
	// Apply brand color from config/query param
	var skin = document.querySelector('video-skin');
	if (skin && color) {
		skin.style.setProperty('--media-brand-color', color);
		skin.style.setProperty('--media-color-primary', color);
	}

	// Set up the video source (HLS)
	var videoEl = document.querySelector('video-player video');
	if (videoEl) {
		// Append origin for cast device compatibility
		videoEl.src = window.location.origin + '/' + playerConfig.source;
		if (playerConfig.poster && playerConfig.poster.length > 0) {
			videoEl.poster = playerConfig.poster + '?t=' + String(new Date().getTime());
		}
		if (mute) {
			videoEl.muted = true;
		}
		if (autoplay) {
			videoEl.muted = true;
			videoEl.autoplay = true;
		}
	}

	// Logo overlay
	if (playerConfig.logo && playerConfig.logo.image && playerConfig.logo.image.length > 0) {
		var playerEl = document.getElementById('player');
		if (playerEl) {
			var logoDiv = document.createElement('div');
			logoDiv.className = 'vjs-logo-overlay ' + (playerConfig.logo.position || 'top-left');

			var img = document.createElement('img');
			img.src = playerConfig.logo.image + '?' + Math.random();
			img.alt = '';

			if (playerConfig.logo.link && playerConfig.logo.link.length > 0) {
				var a = document.createElement('a');
				a.href = playerConfig.logo.link;
				a.target = '_blank';
				a.rel = 'noopener noreferrer';
				a.appendChild(img);
				logoDiv.appendChild(a);
			} else {
				logoDiv.appendChild(img);
			}

			playerEl.style.position = 'relative';
			playerEl.appendChild(logoDiv);
		}
	}
})();
