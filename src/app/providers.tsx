'use client'

import { ThemeProvider } from '@mui/material/styles';
import { StyledEngineProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import '@fontsource/dosis';
import '@fontsource/roboto';

import theme from '../theme';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
	<StyledEngineProvider injectFirst>
	  <ThemeProvider theme={theme}>
		<CssBaseline />
		{children}
	  </ThemeProvider>
	</StyledEngineProvider>
  );
}
