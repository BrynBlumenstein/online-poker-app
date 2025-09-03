import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const ActionButton = ({ handleClick, disabled, label }) => {
	return (
		<Paper
			elevation={6}
			sx={{
				width: 125,
				height: 75
			}}
		>
			<Button
				onClick={handleClick}
				disabled={disabled}
				sx={{ width: '100%', height: '100%' }}
			>
				<Typography variant="caption">{label}</Typography>
			</Button>
		</Paper>
	);
};

export default ActionButton;
