import Stack from '@mui/material/Stack';
import PlayingCard from './playing-card';

const HoleCards = () => {
	return (
		<Stack direction="row" justifyContent="center" spacing={3}>
			<PlayingCard card="Hole card 1" />
			<PlayingCard card="Hole card 2" />
		</Stack>
	);
};

export default HoleCards;
