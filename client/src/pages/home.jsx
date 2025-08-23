import useAuth from '../contexts/auth/use-auth';

const Home = () => {
	const { user } = useAuth();
	return <h1>Hello, {user.username}</h1>;
};

export default Home;
