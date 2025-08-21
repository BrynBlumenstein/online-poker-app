import AuthPage from '../components/auth-page';
import signUpService from '../services/sign-up';

const SignUpPage = () => {
	const onSignUp = async (username, password) => {
		await signUpService.signUp({ username, password });
	};

	return (
		<AuthPage
			label="Sign up"
			onSubmit={onSignUp}
			redirectText="Already have an account?&nbsp;"
			redirectPath="/sign-in"
			redirectLabel="Sign in"
		/>
	);
};

export default SignUpPage;
