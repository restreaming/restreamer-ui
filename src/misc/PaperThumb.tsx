import React from 'react';

import CardMedia from '@mui/material/CardMedia';

export default function Component(props) {
	return (
		<CardMedia
			sx={{
				pt: '39.25%',
				borderRadius: 1,
				height: props.height,
			}}
			image={props.image}
			title={props.title}
		/>
	);
}

Component.defaultProps = {
	image: '',
	title: '',
	height: '0px',
};
