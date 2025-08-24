import { useState } from 'react';
import AuthPage from '../features/auth/auth-page';
import authService from '../features/auth/auth-service';
import useSnackbar from '../contexts/snackbar/use-snackbar';
import {
	isValidUsername,
	isValidPassword
} from '../contexts/auth/auth-utils';

const SignUp = () => {
	const { showSnackbar } = useSnackbar();
	const [usernameError, setUsernameError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);

	const triggerFieldError = (setter) => {
		setter(true);
		setTimeout(() => {
			setter(false);
		}, 5000);
	};

	const onSignUp = async (username, password) => {
		if (!isValidUsername(username)) {
			showSnackbar(`"${username}" is an invalid username`, 'error');
			triggerFieldError(setUsernameError);
			return false;
		}

		if (!isValidPassword(password)) {
			showSnackbar(`"${password}" is an invalid password`, 'error');
			triggerFieldError(setPasswordError);
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
			usernameError={usernameError}
			passwordError={passwordError}
			redirectText="Already have an account?&nbsp;"
			redirectPath="/sign-in"
			redirectLabel="Sign in"
		/>
	);
};

export default SignUp;
