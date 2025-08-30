import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import useSnackbar from '../../contexts/snackbar/use-snackbar';
import useTable from '../../contexts/table/use-table';

const LeaveTableButton = () => {
	const { leaveTable } = useTable();
	const { showSnackbar } = useSnackbar();

	const handleLeave = () => {
		try {
			leaveTable();
			showSnackbar('Successfully left table');
		} catch (err) {
			showSnackbar(err.message, 'error');
		}
	};

	return (
		<Button onClick={handleLeave} variant="contained">
			<Stack direction="row" alignItems="center" spacing={1}>
				<Typography>Leave Table</Typography>
				<ExitToAppIcon />
			</Stack>
		</Button>
	);
};

export default LeaveTableButton;
