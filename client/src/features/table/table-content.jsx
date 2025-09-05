import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useTable from '../../contexts/table/use-table';
import PlayerList from './player-list';
import DealerActions from './dealer-actions';
import BoardCards from './board-cards';
import HoleCards from './hole-cards';
import PlayerActions from './player-actions';

const TableContent = () => {
	const { table } = useTable();

	return (
		<Stack direction="row" spacing={2} sx={{ p: 2 }}>
			<PlayerList />
			<Box sx={{ p: 2, width: '100%' }}>
				<Stack
					alignItems="center"
					justifyContent="space-between"
					sx={{ height: '500px' }}
				>
					<DealerActions />
					<Typography variant="h3">Pot: ${table.pot}</Typography>
					<Typography variant="h4">
						{table.street && `Street: ${table.street}`}
					</Typography>
					<Typography variant="h4">
						Active bet: ${table.activeBet} | Last raise: $
						{table.lastRaise}
					</Typography>
					<BoardCards />
					<Stack spacing={3}>
						<HoleCards />
						<PlayerActions />
					</Stack>
				</Stack>
			</Box>
		</Stack>
	);
};

export default TableContent;
