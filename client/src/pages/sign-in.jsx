import AuthPage from '../features/auth/auth-page';
import authService from '../features/auth/auth-service';
import useAuth from '../contexts/auth/use-auth';
import useSnackbar from '../contexts/snackbar/use-snackbar';

const SignIn = () => {
	const { showSnackbar } = useSnackbar();
	const { signIn } = useAuth();

	const onSignIn = async (username, password) => {
		const response = await authService.signIn({ username, password });
		if (response && response.token) {
			showSnackbar(`Successfully signed in as ${username}.`);
			const { token, ...userData } = response;
			signIn(token, userData);
			return response;
		} else {
			showSnackbar(response || 'Sign-in failed', 'error');
			return null;
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
