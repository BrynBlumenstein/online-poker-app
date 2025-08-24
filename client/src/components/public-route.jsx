import { Navigate } from 'react-router-dom';
import useAuth from '../contexts/auth/use-auth';

const PublicRoute = ({ children }) => {
	const { user, fetchingUser } = useAuth();
	if (fetchingUser) {
		return null;
	}
	return user ? <Navigate to="/" replace /> : children;
};

export default PublicRoute;
