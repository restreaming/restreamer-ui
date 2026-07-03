import React from 'react';

import Box from '@mui/material/Box';

import company_logo from './images/logo.svg';

export default function Logo(props) {
	let link = 'https://datarhei.com';

	// eslint-disable-next-line no-useless-escape
	return (
		<Box
			component="a"
			href={link}
			sx={{ height: 27 }}
			target="_blank"
			rel="noopener noreferrer"
		>
			<img src={company_logo} alt="datarhei logo" />
		</Box>
	);
}
