import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LogoutIcon from '@mui/icons-material/Logout';
import useAuth from '../contexts/auth/use-auth';
import useSnackbar from '../contexts/snackbar/use-snackbar';

const SignOutButton = () => {
	const { signOut } = useAuth();
	const { showSnackbar } = useSnackbar();
	const navigate = useNavigate();

	const handleSignOut = () => {
		signOut();
		showSnackbar('Sign-out successful', 'success');
		navigate('/sign-in', { replace: true });
	};

	return (
		<Button onClick={handleSignOut} variant="contained">
			<Stack direction="row" alignItems="center" spacing={1}>
				<Typography>Sign out</Typography>
				<LogoutIcon />
			</Stack>
		</Button>
	);
};

export default SignOutButton;
