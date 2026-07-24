import React from 'react';

import { styled } from '@mui/material/styles';

import { Trans } from '@lingui/react/macro';
import DeviceUnknownIcon from '@mui/icons-material/DeviceUnknown';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Services from '../Publication/Services';

const PREFIX = 'Egress';

const classes = {
	egressBar: `${PREFIX}-egressBar`,
};

const StyledGrid = styled(Grid)(({ theme }) => ({
	[`&.${classes.egressBar}`]: {
		marginTop: '-.4em',
		marginBottom: '-.2em',
		'& .svg-inline--fa': {
			width: '1.4em',
			height: '1.4em',
		},
		'& .egress-icon': {
			height: '1.4em',
			paddingButton: '.1em',
		},
		'& .egress-left': {
			minHeight: 24,
			minWidth: 30,
			marginRight: 6,
			float: 'left',
			'& img': {
				maxWidth: 22,
				maxHeight: 22,
				marginBottom: '0!important',
			},
		},
		'& .egress-right-edit': {
			float: 'right',
			marginLeft: 5,
			marginTop: 2,
		},
		'& .egress-right-switch': {
			float: 'right',
			marginLeft: 5,
		},
		'& .egress-name': {
			float: 'left',
			whiteSpace: 'nowrap',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			maxWidth: '100%',
			fontSize: '.9rem',
		},
		'& .player-icon': {
			color: theme.palette.secondary.main,
			fontSize: '1.5rem',
		},
	},
}));

export default function Egress(props) {
	const [$order, setOrder] = React.useState('stop');

	React.useEffect(() => {
		(async () => {
			await update();
		})();
	}, []);

	const update = async () => {
		setOrder(props.order);
	};

	const handleSwitch = async (event) => {
		const checked = event.target.checked;

		const order = checked === true ? 'start' : 'stop';

		setOrder(order);

		let onOrder = order;
		if (order === 'start' && $order === 'start') {
			onOrder = 'restart';
		}

		const res = await props.onOrder(onOrder);

		if (res === false) {
			setOrder(order === 'start' ? 'stop' : 'start');
		}
	};

	let name = <Trans>Unknown</Trans>;
	let icon = <DeviceUnknownIcon />;

	if (props.service === 'player') {
		name = <Trans>Player</Trans>;
		icon = <OndemandVideoIcon className="player-icon" />;
	} else {
		const s = Services.Get(props.service);
		if (s !== null) {
			const Icon = s.icon;

			name = s.name;
			if (props.name && props.name.length !== 0) {
				name = props.name;
			}

			icon = <Icon />;
		}
	}

	let checked = props.order === 'start' ? true : false;
	if (props.reconnect === false) {
		if (props.state === 'error' || props.state === 'disconnected') {
			checked = false;
		}
	}

	let color = 'secondary';
	switch (props.state) {
		case 'disconnecting':
		case 'connecting':
			color = 'warning';
			break;
		case 'error':
		case 'disconnected':
			color = 'error';
			break;
		default:
			color = 'secondary';
			break;
	}

	return (
		<StyledGrid container className={classes.egressBar}>
			<Grid size={12}>
				<Stack
					direction="row"
					sx={{
						alignItems: 'center',
						justifyContent: 'space-between',
					}}
					spacing={0}
				>
					<Stack
						className="egress-left"
						direction="row"
						sx={{ alignItems: 'center' }}
						spacing={0}
					>
						<IconButton size="small" className="egress-left">
							{icon}
						</IconButton>
						<Typography className="egress-name">{name}</Typography>
					</Stack>
					<Stack
						direction="row"
						spacing={0}
						sx={{ alignItems: 'center' }}
					>
						{props.service !== 'player' && (
							<Switch
								checked={checked}
								disabled={props.order !== $order}
								onChange={handleSwitch}
								color={color as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
								size="small"
								className="egress-right-switch"
							/>
						)}
						<IconButton
							size="small"
							className="egress-right-edit"
							onClick={props.onEdit}
						>
							<EditIcon />
						</IconButton>
					</Stack>
				</Stack>
			</Grid>
		</StyledGrid>
	);
}

Egress.defaultProps = {
	service: '',
	name: '',
	state: 'disconnected',
	order: 'stop',
	reconnect: true,
	onEdit: function () {},
	onOrder: function (order) {},
};
