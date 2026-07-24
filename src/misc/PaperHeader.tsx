import React from 'react';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import HelpIcon from '@mui/icons-material/HelpOutlined';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

const Component = function (props) {
	return (
		<Grid container spacing={props.spacing} sx={{ padding: props.padding }}>
			<Grid size={12}>
				<Stack
					direction="row"
					sx={{
						alignItems: 'center',
						justifyContent: 'space-between',
						gap: 1,
						minWidth: 0,
					}}
				>
					<Typography variant={props.variant} sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
						{props.title}
					</Typography>
					<Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
				{typeof props.onAbort === 'function' && (
					<IconButton
						color="inherit"
						size="small"
						onClick={props.onAbort}
					>
						<CloseIcon />
					</IconButton>
				)}
				{typeof props.onEdit === 'function' && (
					<IconButton
						color="inherit"
						size="small"
						onClick={props.onEdit}
					>
						<EditIcon />
					</IconButton>
				)}
				{typeof props.onAdd === 'function' && (
					<IconButton
						color="inherit"
						size="small"
						onClick={props.onAdd}
					>
						<AddIcon />
					</IconButton>
				)}
				{typeof props.onHelp === 'function' && (
					<IconButton
						color="inherit"
						size="small"
						onClick={props.onHelp}
					>
						<HelpIcon />
					</IconButton>
				)}
					</Stack>
				</Stack>
			</Grid>
		</Grid>
	);
};

export default Component;

Component.defaultProps = {
	spacing: 0,
	padding: null,
	title: '',
	variant: 'pagetitle',
	onAbort: null,
	onHelp: null,
	onEdit: null,
	onAdd: null,
};
