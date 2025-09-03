import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const HomeTile = ({ level, icon, label, onTileClick, disabled = false }) => {
	return (
		<Paper
			elevation={6}
			sx={{
				width: level === 'top' ? 150 : 250,
				height: level === 'top' ? 150 : 75
			}}
		>
			<Button
				onClick={onTileClick}
				disabled={disabled}
				sx={{ width: '100%', height: '100%' }}
			>
				<Stack alignItems="center" spacing={1}>
					{icon}
					<Typography variant="caption">{label}</Typography>
				</Stack>
			</Button>
		</Paper>
	);
};

export default HomeTile;
