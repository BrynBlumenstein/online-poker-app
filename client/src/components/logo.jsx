import Box from '@mui/material/Box';
import PaidIcon from '@mui/icons-material/Paid';
import Typography from '@mui/material/Typography';

const Logo = () => {
	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				gap: 1
			}}
		>
			<PaidIcon fontSize="large" color="primary" />
			<Typography variant="h4">Online Poker App</Typography>
		</Box>
	);
};

export default Logo;
