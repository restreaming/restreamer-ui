import React from 'react';

import Grid from '@mui/material/Grid';

export default function Component(props) {
	return (
		<Grid sx={{ flexGrow: '1', display: 'flex', height: '100%' }} size={12}>
			{props.children}
		</Grid>
	);
}

Component.defaultProps = {
	children: null,
};
