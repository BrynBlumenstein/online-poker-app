import AuthPage from '../components/auth-page';

const SignInPage = () => {
	const onSignIn = async (username, password) => {
		console.log('sign in', username, password);
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

export default SignInPage;
