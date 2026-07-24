import React from 'react';

export default function Duration(props) {
	const fullSeconds = Math.floor(props.seconds);
	const s = fullSeconds % 60;
	const m = Math.floor(fullSeconds / 60) % 60;
	const h = Math.floor(fullSeconds / (60 * 60)) % 24;
	const d = Math.floor(fullSeconds / (60 * 60 * 24));

	const durationParts = [
		'.' + ((props.seconds - fullSeconds) * 100).toFixed(0),
	];

	if (s < 10) {
		durationParts.unshift(':0' + s);
	} else {
		durationParts.unshift(':' + s);
	}

	if (m < 10) {
		durationParts.unshift(':0' + m);
	} else {
		durationParts.unshift(':' + m);
	}

	if (h < 10) {
		durationParts.unshift('0' + h);
	} else {
		durationParts.unshift('' + h);
	}

	if (d !== 0) {
		durationParts.unshift(d + ':');
	}

	return <React.Fragment>{durationParts.join('')}</React.Fragment>;
}

Duration.defaultProps = {
	seconds: 0,
};
