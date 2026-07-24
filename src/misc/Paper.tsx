import React from 'react';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import type { ReactNode } from 'react';

interface PaperProps {
	marginBottom?: string;
	xs?: number;
	sm?: number;
	md?: number;
	lg?: number;
	className?: string;
	children?: ReactNode;
}

const Component = React.forwardRef<HTMLDivElement, PaperProps>((props, ref) => {
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
				<Paper elevation={0} ref={ref} sx={paperSx}>
					{props.children}
				</Paper>
			</Grid>
		</Grid>
	);
});

export default Component;
