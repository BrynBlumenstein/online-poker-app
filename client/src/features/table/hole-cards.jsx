import Stack from '@mui/material/Stack';
import PlayingCard from './playing-card';
import useAuth from '../../contexts/auth/use-auth';
import useTable from '../../contexts/table/use-table';

const HoleCards = () => {
	const { user } = useAuth();
	const { table } = useTable();

	const player = table.players.get(user.id);

	return (
		<Stack direction="row" justifyContent="center" spacing={3}>
			<PlayingCard card={player.inHand ? `${player.holeCards[0].rank}${player.holeCards[0].suit}` : ''} />
			<PlayingCard card={player.inHand ? `${player.holeCards[1].rank}${player.holeCards[1].suit}` : ''} />
		</Stack>
	);
};

export default HoleCards;
