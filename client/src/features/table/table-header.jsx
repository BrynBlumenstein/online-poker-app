import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import useTable from '../../contexts/table/use-table';
import LeaveTableButton from './leave-table-button';

const TableHeader = () => {
	const { table } = useTable();

	return (
		<Paper>
			<Stack
				direction="row"
				alignItems="center"
				justifyContent="space-between"
				padding={2}
				gap={6}
			>
				<Typography>Join Code: {table.id}</Typography>
				<LeaveTableButton />
			</Stack>
		</Paper>
	);
};

export default TableHeader;
