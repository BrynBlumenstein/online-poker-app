import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import Logo from '../components/logo';
import useAuth from '../contexts/auth/use-auth';
import useSnackbar from '../contexts/snackbar/use-snackbar';

const Home = () => {
	const { user, signOut } = useAuth();
	const { showSnackbar } = useSnackbar();
	const navigate = useNavigate();

	const handleSignOut = () => {
		signOut();
		showSnackbar('Sign-out successful', 'success');
		navigate('/sign-in', { replace: true });
	};

	return (
		<>
			<Logo />
			<IconButton onClick={handleSignOut}>
				<LogoutIcon />
			</IconButton>
			<h1>Hello, {user.username}</h1>
		</>
	);
};

export default Home;
