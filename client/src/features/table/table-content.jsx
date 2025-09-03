import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useTable from '../../contexts/table/use-table';
import PlayerList from './player-list';
import BoardCards from './board-cards';
import HoleCards from './hole-cards';
import Actions from './actions';

const TableContent = () => {
	const { table } = useTable();

	return (
		<Stack direction="row" spacing={2} sx={{ p: 2 }}>
			<PlayerList />
			<Box sx={{ p: 2, width: '100%' }}>
				<Stack
					alignItems="center"
					justifyContent="space-between"
					sx={{ height: '600px' }}
				>
					<Typography variant="h3">Pot: ${table.pot}</Typography>
					<BoardCards />
					<Stack spacing={3}>
						<HoleCards />
						<Actions />
					</Stack>
				</Stack>
			</Box>
		</Stack>
	);
};

export default TableContent;
