import React from 'react';
import { createRoot } from 'react-dom/client';

import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import '@fontsource/dosis';
import '@fontsource/roboto';
import CssBaseline from '@mui/material/CssBaseline';

import theme from './theme';
import RestreamerUI from './RestreamerUI';

const urlParams = new URLSearchParams(window.location.search.substring(1));
const address = urlParams.has('address')
	? urlParams.get('address')
	: window.location.pathname.endsWith('/ui/')
		? window.location.protocol +
			'//' +
			window.location.host +
			window.location.pathname.replace(/ui\/$/, '')
		: window.location.protocol + '//' + window.location.host;

createRoot(document.getElementById('root')).render(
	<StyledEngineProvider injectFirst>
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<RestreamerUI address={address} />
		</ThemeProvider>
	</StyledEngineProvider>,
);
