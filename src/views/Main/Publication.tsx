import React from 'react';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import { Trans } from '@lingui/macro';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import PersonIcon from '@mui/icons-material/Person';
import Typography from '@mui/material/Typography';

import useInterval from '../../hooks/useInterval';
import Egress from './Egress';
import H from '../../utils/help';
import Number from '../../misc/Number';
import Paper from '../../misc/Paper';
import PaperHeader from '../../misc/PaperHeader';
import Services from '../Publication/Services';

const PREFIX = 'Publication';

const classes = {
	viewerCount: `${PREFIX}-viewerCount`,
	vierwerDescription: `${PREFIX}-vierwerDescription`,
	vierwerTypo: `${PREFIX}-vierwerTypo`,
	bandwidth: `${PREFIX}-bandwidth`,
	bandwidthCount: `${PREFIX}-bandwidthCount`,
	bandwidthDescription: `${PREFIX}-bandwidthDescription`,
	bandwidthIcon: `${PREFIX}-bandwidthIcon`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')(({ theme }) => ({
	[`& .${classes.viewerCount}`]: {
		fontSize: '3.5rem',
		fontWeight: 600,
	},

	[`& .${classes.vierwerDescription}`]: {
		marginTop: '-1em',
	},

	[`& .${classes.vierwerTypo}`]: {
		fontSize: '1.1rem',
	},

	[`& .${classes.bandwidth}`]: {
		marginBottom: '.3em',
	},

	[`& .${classes.bandwidthCount}`]: {
		fontSize: '2.5rem',
		fontWeight: 600,
	},

	[`& .${classes.bandwidthDescription}`]: {
		marginTop: '-.5em',
	},

	[`& .${classes.bandwidthIcon}`]: {
		fontSize: '1.7rem',
		paddingRight: 7,
	},
}));

export default function Publication(props) {
	const navigate = useNavigate();
	const services = Services.IDs();
	const [$egresses, setEgresses] = React.useState([]);
	const [$session, setSession] = React.useState({
		viewer: 0,
		bandwidth: 0,
	});

	useInterval(async () => {
		await update();
	}, 1000);

	useInterval(async () => {
		await sessions();
	}, 1000);

	React.useEffect(() => {
		(async () => {
			await update();
		})();
		 
	}, []);

	const update = async () => {
		const egresses = [];

		const processes = await props.restreamer.ListIngestEgresses(
			props.channelid,
			services,
		);

		for (const p of processes) {
			egresses.push({
				id: p.id,
				name: p.name,
				service: p.service,
				index: p.index,
				progress: p.progress,
			});
		}

		setEgresses(egresses);
	};

	const sessions = async () => {
		const current = await props.restreamer.CurrentSessions([
			'ffmpeg',
			'hls',
			'rtmp',
			'srt',
		]);

		setSession({
			viewer: current.sessions,
			bandwidth: current.bitrate_kbit,
		});
	};

	const handleServiceAdd = (event) => {
		event.preventDefault();

		navigate(`/${props.channelid}/publication/`);
	};

	const handleServiceEdit = (service, index) => () => {
		let target = `/${props.channelid}/publication/${service}`;

		if (service !== 'player') {
			target = target + '/' + index;
		}

		navigate(target);
	};

	const handleOrderChange = (id) => async (order) => {
		let res = false;

		if (order === 'start') {
			res = await props.restreamer.StartEgress(props.channelid, id);
		} else if (order === 'restart') {
			res = await props.restreamer.StopEgress(props.channelid, id);
			if (res === true) {
				res = await props.restreamer.StartEgress(props.channelid, id);
			}
		} else if (order === 'stop') {
			res = await props.restreamer.StopEgress(props.channelid, id);
		}

		return res;
	};

	const handleHelp = () => {
		H('publication');
	};

	const egresses = [];

	for (const e of $egresses.values()) {
		egresses.push(
			<Root key={e.id}>
				<Grid size={12}>
					<Divider />
				</Grid>
				<Grid size={12}>
					<Egress
						service={e.service}
						name={e.name}
						state={e.progress.state}
						order={e.progress.order}
						reconnect={e.progress.reconnect !== -1}
						onEdit={handleServiceEdit(e.service, e.index)}
						onOrder={handleOrderChange(e.id)}
					/>
				</Grid>
			</Root>,
		);
	}

	return (
        <React.Fragment>
            <Paper marginBottom="0">
				<PaperHeader
					title={<Trans>Publications</Trans>}
					onAdd={handleServiceAdd}
					onHelp={handleHelp}
				/>
				<Grid container spacing={1}>
					<Grid sx={{ textAlign: 'center' }} size={12}>
						<Divider />
						<Typography
							component="div"
							className={classes.viewerCount}
						>
							<Number value={$session.viewer} />
						</Typography>
						<Grid
							container
							direction="row"
							sx={{
								alignItems: 'center',
								justifyContent: 'center',
							}}
							className={classes.vierwerDescription}
						>
							<PersonIcon fontSize="small" />
							<Typography className={classes.vierwerTypo}>
								<Trans>Viewer</Trans>
							</Typography>
						</Grid>
					</Grid>
					<Grid className={classes.bandwidth} sx={{ textAlign: 'center' }} size={12}>
						<Typography
							component="div"
							className={classes.bandwidthCount}
						>
							<Number value={$session.bandwidth} />
						</Typography>
						<Grid
							container
							direction="row"
							sx={{
								alignItems: 'center',
								justifyContent: 'center',
							}}
							className={classes.bandwidthDescription}
						>
							<CloudUploadIcon
								className={classes.bandwidthIcon}
							/>
							<Typography>
								<Trans>kbit/s</Trans>
							</Typography>
						</Grid>
					</Grid>
					{egresses}
				</Grid>
			</Paper>
        </React.Fragment>
    );
}

Publication.defaultProps = {
	channelid: '',
	restreamer: null,
};
