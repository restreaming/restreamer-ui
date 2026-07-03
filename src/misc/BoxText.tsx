import React from 'react';

import Stack from '@mui/material/Stack';

export default function Component(props) {
	const boxSx =
		props.color === 'dark'
			? {
					backgroundColor: 'background.dark2',
					borderRadius: 1,
					p: '10px 15px',
					wordWrap: 'break-word',
					wordBreak: 'break-word',
					overflowWrap: 'break-word',
				}
			: props.color === 'success'
				? {
						color: 'background.paper',
						fontWeight: 500,
						backgroundColor: 'secondary.main',
						borderRadius: 1,
						p: '10px 15px',
						wordWrap: 'break-word',
						wordBreak: 'break-word',
						overflowWrap: 'break-word',
					}
				: props.color === 'danger'
					? {
							backgroundColor: 'error.main',
							textAlign: 'center',
							borderRadius: 1,
							p: '.5em .5em .3em .5em',
							wordWrap: 'break-word',
							wordBreak: 'break-word',
							overflowWrap: 'break-word',
						}
					: {
							backgroundColor: 'background.light1',
							borderRadius: 1,
							p: '10px 15px',
							wordWrap: 'break-word',
							wordBreak: 'break-word',
							overflowWrap: 'break-word',
						};

	return (
		<Stack
			direction="column"
			justifyContent={props.justifyContent}
			alignItems={props.alignItems}
			textAlign={props.textAlign}
			spacing={1}
			sx={boxSx}
			{...props}
		>
			{props.children}
		</Stack>
	);
}

Component.defaultProps = {
	color: 'light',
	textAlign: 'left',
	alignItems: 'center',
	justifyContent: 'center',
};
