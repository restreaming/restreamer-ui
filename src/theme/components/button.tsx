import base from '../base';

const root = {
	textAlign: 'center',
	textTransform: 'uppercase',
	userSelect: 'none',
	borderRadius: 10,
	minHeight: 42,
	padding: '0 18px',
	transition:
		'transform .18s ease, box-shadow .18s ease, background-color .18s ease',
	'&:hover': {
		transform: 'translateY(-1px)',
	},
};

const outlined = {
	base: {
		color: base.palette.text.primary,
		backgroundColor: base.palette.background.dark1,
		border: `1px solid ${base.palette.primary.main}`,
		boxShadow: '0 8px 18px rgba(0, 0, 0, .16)',
		'&:hover': {
			color: base.palette.primary.contrastText,
			backgroundColor: base.palette.background.dark1,
			border: `1px solid ${base.palette.primary.light}`,
		},
		'&:disabled': {
			color: `${base.palette.text.disabled}`,
			border: `2px solid ${base.palette.primary.light}`,
		},
		'&.Mui-disabled': {
			backgroundColor: `${base.palette.background.button_disabled}`,
			border: `2px solid ${base.palette.text.disabled}`,
			color: `${base.palette.text.disabled}`,
		},
	},
	primary: {
		color: base.palette.text.primary,
		backgroundColor: base.palette.background.dark1,
		border: `1px solid ${base.palette.secondary.main}`,
		'&:hover': {
			color: base.palette.secondary.contrastText,
			backgroundColor: base.palette.secondary.main,
			border: `1px solid ${base.palette.secondary.main}`,
		},
	},
	// color secondary: danger
	secondary: {
		color: base.palette.text.primary,
		backgroundColor: base.palette.background.dark1,
		border: `2px solid ${base.palette.error.main}`,
		'&:hover': {
			color: base.palette.error.contrastText,
			backgroundColor: base.palette.error.main,
			border: `2px solid ${base.palette.error.main}`,
		},
	},
};

export default {
	variants: [
		{
			props: { variant: 'big' },
			style: {
				height: 138,
				width: '100%',
				borderRadius: 14,
				padding: '18px 12px',
				textTransform: 'initial!important',
				color: base.palette.text.primary,
				backgroundColor: base.palette.background.dark1,
				border: `1px solid ${base.palette.primary.main}`,
				background:
					'linear-gradient(145deg, rgba(52, 74, 98, .5), rgba(8, 15, 24, .55))',
				'&:hover': {
					color: base.palette.primary.contrastText,
					backgroundColor: base.palette.background.dark1,
					border: `1px solid ${base.palette.secondary.main}!important`,
				},
				'&:active': {
					border: `1px solid ${base.palette.secondary.main}!important`,
				},
				'&.Mui-disabled': {
					border: `2px solid ${base.palette.text.disabled}!important`,
					color: `${base.palette.text.primary}!important`,
					opacity: 0.4,
				},
				'& svg': {
					fontSize: '2.5em',
					maxHeight: '40px',
					maxWidth: '40px',
				},
				'& img': {
					fontSize: '2.5em',
					maxHeight: '40px',
					maxWidth: '40px',
				},
			},
		},
		{
			props: { variant: 'bigSelected' },
			style: {
				height: 138,
				width: '100%',
				borderRadius: 14,
				padding: '18px 12px',
				textTransform: 'initial!important',
				color: base.palette.text.primary,
				backgroundColor: base.palette.background.dark1,
				border: `1px solid ${base.palette.secondary.main}!important`,
				'&:hover': {
					color: base.palette.primary.contrastText,
					backgroundColor: base.palette.background.dark1,
					border: `2px solid ${base.palette.secondary.main}!important`,
				},
				'& svg': {
					fontSize: '2.5em',
					maxHeight: '40px',
					maxWidth: '40px',
				},
				'& img': {
					fontSize: '2.5em',
					maxHeight: '40px',
					maxWidth: '40px',
				},
			},
		},
		{
			props: { variant: 'service' },
			style: {
				color: base.palette.text.primary,
				backgroundColor: base.palette.background.dark1,
				border: `2px solid ${base.palette.service.main}!important`,
				'&:hover': {
					color: base.palette.common.black,
					backgroundColor: base.palette.service.main,
					border: `2px solid ${base.palette.service.main}!important`,
				},
			},
		},
	],
	styleOverrides: {
		root: { ...root },
		outlined: { ...outlined.base },
		outlinedPrimary: { ...outlined.primary },
		outlinedSecondary: { ...outlined.secondary },
	},
};
