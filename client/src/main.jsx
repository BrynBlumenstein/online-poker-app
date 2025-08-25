import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import App from './app';
import AuthProvider from './contexts/auth/auth-provider';
import SnackbarProvider from './contexts/snackbar/snackbar-provider';

const theme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: '#a5d6a7'
		}
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				html: {
					overflowY: 'scroll'
				}
			}
		}
	}
});

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<AuthProvider>
				<SnackbarProvider>
					<App />
				</SnackbarProvider>
			</AuthProvider>
		</ThemeProvider>
	</StrictMode>
);
