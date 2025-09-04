import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import SnackbarProvider from '../contexts/snackbar/snackbar-provider';
import AuthProvider from '../contexts/auth/auth-provider';
import SocketProvider from '../contexts/socket/socket-provider';
import TableProvider from '../contexts/table/table-provider';

const theme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
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
			<SnackbarProvider>
				<AuthProvider>
					<SocketProvider>
						<TableProvider>{children}</TableProvider>
					</SocketProvider>
				</AuthProvider>
			</SnackbarProvider>
		</ThemeProvider>
	);
};

export default AppProviders;
