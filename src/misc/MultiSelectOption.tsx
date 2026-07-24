import React from 'react';

import MenuItem from '@mui/material/MenuItem';

interface MultiSelectOptionProps {
	name?: string;
	value?: string;
	selected?: boolean;
}

const Component = React.forwardRef<HTMLLIElement, MultiSelectOptionProps>(
	(props, ref) => {
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
	},
);

export default Component;
