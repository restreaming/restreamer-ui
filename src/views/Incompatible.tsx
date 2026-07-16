import React from 'react';

import { Trans } from '@lingui/react/macro';

import Paper from '../misc/Paper';
import PaperHeader from '../misc/PaperHeader';
import PaperContent from '../misc/PaperContent';

export default function Incompatible(props) {
	const text =
		props.type === 'core' ? (
			<Trans>
				This version of the UI doesn't support the connected Core (
				{props.have}). The UI requires {props.want}. Please use a
				compatible version of the UI.
			</Trans>
		) : props.type === 'ffmpeg' ? (
			<Trans>
				This version of the UI doesn't support the available FFmpeg
				binary ({props.have}). The UI requires {props.want}. Please use
				a supported FFmpeg binary.
			</Trans>
		) : (
			<Trans>This version of the UI is compatible.</Trans>
		);

	return (
		<Paper xs={8} sm={6} md={6} className="PaperM">
			<PaperHeader title={<Trans>Error</Trans>} />
			<PaperContent>{text}</PaperContent>
		</Paper>
	);
}

Incompatible.defaultProps = {
	type: '',
	have: '',
	want: '',
};
