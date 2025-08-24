import AuthPage from '../features/auth/auth-page';
import authService from '../features/auth/auth-service';
import useAuth from '../contexts/auth/use-auth';
import useSnackbar from '../contexts/snackbar/use-snackbar';
import {
	isValidUsername,
	isValidPassword
} from '../contexts/auth/auth-utils';

const SignIn = () => {
	const { showSnackbar } = useSnackbar();
	const { signIn } = useAuth();

	const onSignIn = async (username, password) => {
		if (!(isValidUsername(username) && isValidPassword(password))) {
			showSnackbar('Invalid username or password', 'error');
			return false;
		}

		try {
			const user = await authService.signIn({ username, password });
			const { token, ...userData } = user;
			signIn(token, userData);
			showSnackbar(`Signed in as ${username}`);
			return true;
		} catch (err) {
			showSnackbar(err.message, 'error');
			return false;
		}
	};

	return (
		<AuthPage
			label="Sign in"
			onSubmit={onSignIn}
			redirectText="Need to create an account?&nbsp;"
			redirectPath="/sign-up"
			redirectLabel="Sign up"
		/>
	);
};

export default SignIn;
