import { useState, useCallback, useMemo } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import SnackbarContext from '../contexts/snackbar-context';

const SnackbarProvider = ({ children }) => {
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: '',
		severity: 'success'
	});

	const showSnackbar = useCallback((message, severity = 'success') => {
		setSnackbar({ open: true, message, severity });
	}, []);

	const hideSnackbar = useCallback(() => {
		setSnackbar((prev) => ({ ...prev, open: false }));
	}, []);

	const contextValue = useMemo(
		() => ({
			showSnackbar,
			hideSnackbar
		}),
		[showSnackbar, hideSnackbar]
	);

	return (
		<SnackbarContext.Provider value={contextValue}>
			<Snackbar
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				open={snackbar.open}
				autoHideDuration={5000}
				onClose={(event, reason) => {
					if (reason === 'clickaway') return;
					hideSnackbar();
				}}
			>
				<Alert onClose={hideSnackbar} severity={snackbar.severity}>
					{snackbar.message}
				</Alert>
			</Snackbar>
			{children}
		</SnackbarContext.Provider>
	);
};

export default SnackbarProvider;
