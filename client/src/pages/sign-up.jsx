import AuthPage from '../features/auth/auth-page';
import authService from '../services/auth-service';
import useSnackbar from '../contexts/snackbar/use-snackbar';
import {
	isValidUsername,
	isValidPassword
} from '../contexts/auth/auth-utils';

const SignUp = () => {
	const { showSnackbar } = useSnackbar();

	const onSignUp = async (username, password) => {
		if (!(isValidUsername(username) && isValidPassword(password))) {
			showSnackbar('Invalid username or password', 'error');
			return false;
		}

		try {
			const user = await authService.signUp({ username, password });
			showSnackbar(`${user.username} signed up`);
			return true;
		} catch (err) {
			showSnackbar(err.message, 'error');
			return false;
		}
	};

	return (
		<AuthPage
			onSubmit={onSignUp}
			label="Sign up"
			usernameHelperText="Username must be 3-15 characters long and can only contain letters, numbers, or underscores."
			passwordHelperText="Password must be 8–20 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)."
			redirectText="Already have an account?&nbsp;"
			redirectPath="/sign-in"
			redirectLabel="Sign in"
		/>
	);
};

export default SignUp;
