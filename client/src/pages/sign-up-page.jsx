import AuthPage from '../components/auth-page';
import signUpService from '../services/sign-up';
import useSnackbar from '../hooks/use-snackbar';

const SignUpPage = () => {
	const { showSnackbar } = useSnackbar();

	const isValidUsername = (username) => {
		const regex = /^[a-zA-Z0-9_]{3,15}$/;
		if (
			!username ||
			typeof username !== 'string' ||
			!regex.test(username)
		) {
			return false;
		}

		return true;
	};

	const isValidPassword = (password) => {
		const regex =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
		if (
			!password ||
			typeof password !== 'string' ||
			!regex.test(password)
		) {
			return false;
		}

		return true;
	};

	const onSignUp = async (username, password) => {
		const usernameValid = isValidUsername(username);
		const passwordValid = isValidPassword(password);

		if (!usernameValid) {
			showSnackbar(`${username} is an invalid username.`, 'error');
		} else if (!passwordValid) {
			showSnackbar(`${password} is an invalid password.`, 'error');
		}

		let response = null;

		if (usernameValid && passwordValid) {
			response = await signUpService.signUp({ username, password });
			if (!response?.error) {
				showSnackbar(`${username} successfully signed up.`);
			} else {
				showSnackbar(response.error, 'error');
			}
		}

		return response;
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

export default SignUpPage;
