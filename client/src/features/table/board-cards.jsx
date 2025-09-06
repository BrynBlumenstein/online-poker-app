import Stack from '@mui/material/Stack';
import PlayingCard from './playing-card';
import useTable from '../../contexts/table/use-table';

const BoardCards = () => {
	const { table } = useTable();

	return (
		<Stack direction="row" justifyContent="center" spacing={6}>
			<PlayingCard
				card={
					table.street && table.street !== 'preflop'
						? `${table.boardCards[0].rank}${table.boardCards[0].suit}`
						: ''
				}
			/>
			<PlayingCard
				card={
					table.street && table.street !== 'preflop'
						? `${table.boardCards[1].rank}${table.boardCards[1].suit}`
						: ''
				}
			/>
			<PlayingCard
				card={
					table.street && table.street !== 'preflop'
						? `${table.boardCards[2].rank}${table.boardCards[2].suit}`
						: ''
				}
			/>
			<PlayingCard
				card={
					table.street &&
					table.street !== 'preflop' &&
					table.street !== 'flop'
						? `${table.boardCards[3].rank}${table.boardCards[3].suit}`
						: ''
				}
			/>
			<PlayingCard
				card={
					table.street &&
					table.street !== 'preflop' &&
					table.street !== 'flop' &&
					table.street !== 'turn'
						? `${table.boardCards[4].rank}${table.boardCards[4].suit}`
						: ''
				}
			/>
		</Stack>
	);
};

export default BoardCards;
