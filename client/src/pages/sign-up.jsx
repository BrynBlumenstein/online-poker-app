import { useState } from 'react';
import AuthPage from '../features/auth/auth-page';
import authService from '../features/auth/auth-service';
import useSnackbar from '../contexts/snackbar/use-snackbar';

const SignUp = () => {
	const { showSnackbar } = useSnackbar();
	const [usernameError, setUsernameError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);

	const isValidUsername = (username) => {
		return /^[a-zA-Z0-9_]{3,15}$/.test(username);
	};

	const isValidPassword = (password) => {
		return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/.test(
			password
		);
	};

	const triggerFieldError = (setter) => {
		setter(true);
		setTimeout(() => {
			setter(false);
		}, 5000);
	};

	const onSignUp = async (username, password) => {
		let valid = true;

		if (!isValidUsername(username)) {
			showSnackbar(`"${username}" is an invalid username.`, 'error');
			triggerFieldError(setUsernameError);
			valid = false;
		} else if (!isValidPassword(password)) {
			showSnackbar(`"${password}" is an invalid password.`, 'error');
			triggerFieldError(setPasswordError);
			valid = false;
		}

		if (!valid) {
			return null;
		}

		const response = await authService.signUp({ username, password });
		if (response && response.username) {
			showSnackbar(`${username} successfully signed up.`);
			return response;
		} else {
			showSnackbar(response.error, 'error');
			return null;
		}
	};

	return (
		<AuthPage
			onSubmit={onSignUp}
			label="Sign up"
			usernameHelperText="Username must be 3-15 characters long and can only contain letters, numbers, or underscores."
			passwordHelperText="Password must be 8–20 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)."
			usernameError={usernameError}
			passwordError={passwordError}
			redirectText="Already have an account?&nbsp;"
			redirectPath="/sign-in"
			redirectLabel="Sign in"
		/>
	);
};

export default SignUp;
