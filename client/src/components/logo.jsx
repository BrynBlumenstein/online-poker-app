import Stack from '@mui/material/Stack';
import PaidIcon from '@mui/icons-material/Paid';
import Typography from '@mui/material/Typography';

const Logo = () => {
	return (
		<>
			<Stack direction="row" alignItems="center" spacing={1}>
				<PaidIcon fontSize="large" color="primary" />
				<Typography variant="h4">Online Poker App</Typography>
			</Stack>
		</>
	);
};

export default Logo;
