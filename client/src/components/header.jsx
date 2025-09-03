import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Logo from './logo';
import SignOutButton from './sign-out-button';
import useAuth from '../contexts/auth/use-auth';

const Header = () => {
	const { user } = useAuth();

	return (
		<Paper>
			<Stack
				direction="row"
				alignItems="center"
				justifyContent="space-between"
				padding={2}
				gap={6}
			>
				<Logo />
				{user && (
					<Stack direction="row" alignItems="center" spacing={4}>
						{/* <Typography variant='body1'>Current Balance: ${user.balance}</Typography> */}
						<Typography variant='h6'>{user.username}</Typography>
						<SignOutButton />
					</Stack>
				)}
			</Stack>
		</Paper>
	);
};

export default Header;
