import Paper from '@mui/material/Paper';

const PlayingCard = ({ card }) => {
	return (
		<Paper
			elevation={6}
			sx={{
				width: 75,
				height: 125
			}}
		>
			{card}
		</Paper>
	);
};

export default PlayingCard;
