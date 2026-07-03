import React from 'react';

import Stack from '@mui/material/Stack';

export default function Component(props) {
	return (
		<Stack
			direction="column"
			justifyContent="center"
			alignItems="center"
			spacing={1}
			sx={{
				backgroundColor: 'background.modalbox',
				borderRadius: 1,
				p: '0em 1em',
				width: '100%',
			}}
			{...props}
		>
			{props.children}
		</Stack>
	);
}

Component.defaultProps = {};
