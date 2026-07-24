import React from 'react';

import { Trans } from '@lingui/react/macro';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import HelpIcon from '@mui/icons-material/HelpOutlined';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { CSSProperties, ReactNode } from 'react';

interface ModalContentProps {
	title?: ReactNode;
	onClose?: (() => void) | null;
	onHelp?: (() => void) | null;
	children?: ReactNode;
	className?: string;
	style?: CSSProperties;
}

const Component = React.forwardRef<HTMLDivElement, ModalContentProps>(
	(props, ref) => {
	const { title, onClose, onHelp, ...other } = props;

	return (
		<Paper
			sx={{
				p: '1em 1.5em 1.3em 1.5em',
				width: '95%',
				maxWidth: 980,
				maxHeight: '95%',
				overflow: 'scroll',
				bgcolor: 'background.modal',
				color: 'text.primary',
			}}
			elevation={0}
			tabIndex={-1}
			ref={ref}
			{...other}
		>
			<Grid container spacing={0}>
				<Grid
					sx={{
						marginBottom: '.7em',
						'& button': {
							float: 'right',
							marginLeft: '.5em',
							paddingTop: '.25em',
							marginRight: '-.7em',
						},
					}}
					size={12}
				>
					<Stack
						direction="row"
						spacing={2}
						sx={{
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<Typography variant="button">{props.title}</Typography>
						<Stack
							direction="row"
							spacing={2}
							sx={{
								justifyContent: 'flex-end',
								alignItems: 'center',
							}}
						>
							{typeof props.onHelp === 'function' && (
								<IconButton
									color="inherit"
									size="small"
									onClick={props.onHelp}
								>
									<HelpIcon fontSize="small" />
								</IconButton>
							)}
							{typeof props.onClose === 'function' && (
								<IconButton
									color="inherit"
									size="small"
									onClick={props.onClose}
								>
									<CloseIcon fontSize="small" />
								</IconButton>
							)}
						</Stack>
					</Stack>
				</Grid>
			</Grid>
			{props.children}
			<Grid container spacing={0}>
				<Grid
					sx={{
						marginTop: '1.2em',
						minHeight: '38px',
						'& button': {
							marginRight: '.5em',
						},
						'& .right': {
							float: 'right',
							marginRight: '0',
							marginLeft: '.5em',
						},
					}}
					size={12}
				>
					<Button
						variant="outlined"
						color="default"
						onClick={props.onClose}
					>
						<Trans>Close</Trans>
					</Button>
				</Grid>
			</Grid>
		</Paper>
	);
	},
);

export default Component;
