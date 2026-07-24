import base from '../base';

export default {
	styleOverrides: {
		root: {
			width: '100%',
			minWidth: 0,
			textTransform: 'initial',
			margin: '0em 1.4em .2em 0em',
			color: base.palette.text.secondary,
			textAlign: 'left',
			minHeight: '30px',
			borderRadius: '5px',
			alignItems: 'flex-start',
			whiteSpace: 'normal',
			lineHeight: 1.2,
			'&.Mui-selected': {
				color: base.palette.text.primary,
				backgroundColor: `${base.palette.primary.dark}`,
			},
		},
		wrapper: {
			alignItems: 'flex-start',
			padding: 0,
		},
	},
};
