import React from 'react';

import MenuItem from '@mui/material/MenuItem';

const Component = React.forwardRef<HTMLElement, any>((props, ref) => {
	const { name, value, selected, ...other } = props;

	return (
		<MenuItem
			value={props.value}
			sx={
				props.selected
					? {
							fontWeight: 'bold',
							bgcolor: 'background.dark1',
						}
					: undefined
			}
			ref={ref}
			{...other}
		>
			{props.name}
		</MenuItem>
	);
});

export default Component;

Component.defaultProps = {
	name: '',
	value: '',
	selected: false,
};
