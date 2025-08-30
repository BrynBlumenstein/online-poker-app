import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import AuthProvider from '../contexts/auth/auth-provider';
import SnackbarProvider from '../contexts/snackbar/snackbar-provider';
import TableProvider from '../contexts/table/table-provider';

const theme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			// main: '#36413E'
			main: '#D7D6D6'
		}
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				html: {
					overflowY: 'scroll'
				}
			}
		},
		MuiDialog: {
			defaultProps: {
				disableScrollLock: true
			}
		}
	}
});

const AppProviders = ({ children }) => {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<AuthProvider>
				<TableProvider>
					<SnackbarProvider>{children}</SnackbarProvider>
				</TableProvider>
			</AuthProvider>
		</ThemeProvider>
	);
};

export default AppProviders;
