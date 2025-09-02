import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import useTable from '../../contexts/table/use-table';

const LeaveTableButton = () => {
	const { leaveTable } = useTable();

	const handleLeave = () => {
		leaveTable();
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
