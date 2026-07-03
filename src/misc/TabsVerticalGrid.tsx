import React from 'react';

import Grid from '@mui/material/GridLegacy';

export default function Component(props) {
	return (
		<Grid
			item
			xs={12}
			sx={{ flexGrow: '1', display: 'flex', height: '100%' }}
		>
			{props.children}
		</Grid>
	);
}

Component.defaultProps = {
	children: null,
};
