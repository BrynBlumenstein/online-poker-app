import Stack from '@mui/material/Stack';
import PlayingCard from './playing-card';

const BoardCards = () => {
	return (
		<Stack direction="row" justifyContent="center" spacing={6}>
			<PlayingCard card="Board card 1" />
			<PlayingCard card="Board card 2" />
			<PlayingCard card="Board card 3" />
			<PlayingCard card="Board card 4" />
			<PlayingCard card="Board card 5" />
		</Stack>
	);
};

export default BoardCards;
