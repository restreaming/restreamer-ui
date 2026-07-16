import React from 'react';

import Box from '@mui/material/Box';

import company_logo from './images/rs-logo.svg';

export default function Logo(props) {
	const link = 'https://github.com/datarhei/restreamer';

	return (
		<Box
			component="a"
			href={link}
			sx={{ height: 95 }}
			target="_blank"
			rel="noopener noreferrer"
		>
			<img src={company_logo} alt="datarhei logo" />
		</Box>
	);
}
