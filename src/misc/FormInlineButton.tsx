import React from 'react';

import Button from '@mui/material/Button';

export default function Component(props) {
	return (
		<Button
			variant="outlined"
			size="large"
			fullWidth
			color="primary"
			sx={{
				fontSize: '.9rem!important',
				height: '56px!important',
			}}
			{...props}
		>
			{props.children}
		</Button>
	);
}

Component.defaultProps = {};
