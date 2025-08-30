import { useNavigate } from 'react-router-dom';
import AuthPage from '../features/auth/auth-page';
import useAuth from '../contexts/auth/use-auth';
import useSnackbar from '../contexts/snackbar/use-snackbar';
import { isValidUsername, isValidPassword } from '../contexts/auth/auth-utils';

const SignUp = () => {
	const { showSnackbar } = useSnackbar();
	const { signUp } = useAuth();
	const navigate = useNavigate();

	const onSignUp = async (username, password) => {
		if (!(isValidUsername(username) && isValidPassword(password))) {
			showSnackbar('Invalid username or password', 'error');
		}

		try {
			const user = await signUp({ username, password });
			showSnackbar(`${user.username} signed up`);
			navigate('/sign-in');
		} catch (err) {
			showSnackbar(err.message, 'error');
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
