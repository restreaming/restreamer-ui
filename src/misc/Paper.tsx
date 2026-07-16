import React from 'react';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

const Component = React.forwardRef((props, ref) => {
	let { marginBottom, xs, sm, md, ld, className, elevation, ...other } =
		props;

	elevation = 0;

	const paperSx =
		props.className === 'paperM'
			? {
					p: '3em 3.5em',
				}
			: props.className === 'paperL'
				? {
						p: '4em 4.5em',
					}
				: props.className === 'paperService'
					? {
							p: '4em 4.5em',
							border: '1px solid',
							borderColor: 'background.light1',
							bgcolor: 'service.contrastText',
						}
					: {};

	return (
		<Grid
			container
			spacing={1}
			sx={{ justifyContent: 'center' }}
			style={{ marginBottom: props.marginBottom }}
		>
			<Grid
				size={{
					xs: props.xs,
					sm: props.sm,
					md: props.md,
					lg: props.lg,
				}}
			>
				<Paper elevation={elevation} ref={ref} sx={paperSx} {...other}>
					{props.children}
				</Paper>
			</Grid>
		</Grid>
	);
});

export default Component;

Component.defaultProps = {
	marginBottom: '6em',
	xs: 12,
	sm: undefined,
	md: undefined,
	lg: undefined,
	elevation: 0,
	className: 'paper',
};
