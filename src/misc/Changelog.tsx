import React from 'react';

import { Trans } from '@lingui/macro';
import Button from '@mui/material/Button';
import Grid from '@mui/material/GridLegacy';
import { styled } from '@mui/material/styles';
import ReactMarkdown from 'react-markdown';
import SemverGt from 'semver/functions/gt';
import SemverLte from 'semver/functions/lte';
import SemverEq from 'semver/functions/eq';
import SemverValid from 'semver/functions/valid';

import BoxText from './BoxText';
import Dialog from './modals/Dialog';

const H1 = styled('h1')(({ theme }) => ({
	fontFamily: theme.typography.h1.fontFamily,
	fontSize: theme.typography.h1.fontSize,
	marginTop: '.5rem',
	marginBottom: '-1rem',
}));

const H2 = styled('h2')(({ theme }) => ({
	fontFamily: theme.typography.h2.fontFamily,
	fontSize: theme.typography.h2.fontSize,
	paddingTop: '1.5rem',
	marginBottom: theme.typography.h2.marginBottom,
	'&::after': {
		content: '""',
		display: 'block',
		height: 1,
		backgroundColor: theme.palette.primary.contrastText,
	},
}));

const H3 = styled('h3')(({ theme }) => ({
	fontFamily: theme.typography.h3.fontFamily,
	fontSize: theme.typography.h3.fontSize,
	paddingTop: '.5rem',
	marginBottom: theme.typography.h3.marginBottom,
}));

const H4 = styled('h4')(({ theme }) => ({
	fontFamily: theme.typography.h4.fontFamily,
	fontSize: theme.typography.h4.fontSize,
	marginBottom: theme.typography.h4.marginBottom,
}));

const A = styled('a')(({ theme }) => ({
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
}));

export default function Changelog(props) {
	const [$data, setData] = React.useState('');

	React.useEffect(() => {
		(async () => {
			await onMount();
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onMount = async () => {
		let data = await loadData();
		data = filter(data, props.current, props.previous);

		setData(data);
	};

	const loadData = async () => {
		let response = null;

		try {
			response = await fetch('CHANGELOG.md', {
				method: 'GET',
			});
		} catch (err) {
			return '';
		}

		if (response.ok === false) {
			return '';
		}

		return await response.text();
	};

	const filter = (data, current, previous) => {
		let lines = data.split('\n');
		let filteredLines = [];

		let copy = true;

		for (let i = 0; i < lines.length; i++) {
			if (lines[i].startsWith('## ')) {
				let version = lines[i].replace('## ', '');

				if (SemverValid(version) === null) {
					if (copy === true) {
						filteredLines.push(lines[i]);
					}

					continue;
				}

				if (current.length === 0) {
					current = version;
				}

				if (previous.length === 0) {
					previous = version;
				}

				if (SemverEq(current, previous)) {
					if (SemverEq(version, current)) {
						copy = true;
					} else {
						copy = false;
					}
				} else {
					if (
						SemverLte(version, current) &&
						SemverGt(version, previous)
					) {
						copy = true;
					} else {
						copy = false;
					}
				}
			}

			if (copy === true) {
				filteredLines.push(lines[i]);
			}
		}

		return filteredLines.join('\n');
	};

	if ($data.length === 0 || $data.startsWith('<!DOCTYPE')) {
		return null;
	}

	const renderers = {
		h1: (props) => <H1 {...props}>{props.children}</H1>,
		h2: (props) => <H2 {...props}>{props.children}</H2>,
		h3: (props) => <H3 {...props}>{props.children}</H3>,
		h4: (props) => <H4 {...props}>{props.children}</H4>,
		a: (props) => (
			<A target="_blank" {...props}>
				{props.children}
			</A>
		),
	};

	return (
		<Dialog
			open={props.open}
			onClose={props.onClose}
			title={<Trans>Update details (Changelog)</Trans>}
			maxWidth={600}
			buttonsRight={
				<Button
					variant="outlined"
					color="primary"
					onClick={props.onClose}
				>
					<Trans>Close</Trans>
				</Button>
			}
		>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<BoxText alignItems="flex-start">
						<ReactMarkdown components={renderers}>
							{$data}
						</ReactMarkdown>
					</BoxText>
				</Grid>
			</Grid>
		</Dialog>
	);
}

Changelog.defaultProps = {
	open: false,
	current: '',
	previous: '',
	onClose: () => {},
};
