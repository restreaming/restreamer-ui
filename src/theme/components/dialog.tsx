import base from '../base';

export default {
	styleOverrides: {
		root: {
			padding: '1.5rem',
			width: '95%',
			maxWidth: 540,
			maxHeight: '95%',
			overflow: 'scroll',
			backgroundColor: base.palette.background.modal,
			border: `1px solid ${base.palette.background.light1}`,
			borderRadius: 18,
			boxShadow: '0 24px 80px rgba(0, 0, 0, .45)',
			color: base.palette.text.primary,
		},
	},
};
