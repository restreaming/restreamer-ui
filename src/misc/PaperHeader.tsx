import React from 'react';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import HelpIcon from '@mui/icons-material/HelpOutline';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

const Component = function (props) {
	return (
        <Grid container spacing={props.spacing} padding={props.padding}>
            <Grid
                sx={{
					marginBottom: '.3em',
					'& button': {
						float: 'right',
						marginLeft: '.5em',
					},
				}}
                size={12}>
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
				<Typography variant={props.variant}>{props.title}</Typography>
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
