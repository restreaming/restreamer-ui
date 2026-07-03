import React from 'react';

import Grid from '@mui/material/GridLegacy';

const Component = function (props) {
	return (
		<Grid container spacing={3}>
			<Grid
				item
				xs={12}
				sx={{
					marginBottom: '.3em',
					marginTop: '1.2em',
					minHeight: '38px',
					'& button': {
						marginRight: '.5em',
					},
					'& div button': {
						float: 'right',
						marginRight: '0',
						marginLeft: '.5em',
					},
				}}
			>
				<div>{props.buttonsRight}</div>
				{props.buttonsLeft}
			</Grid>
		</Grid>
	);
};

export default Component;

Component.defaultProps = {
	buttonsLeft: null,
	buttonsRight: null,
};
