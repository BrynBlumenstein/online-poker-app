import { Navigate } from 'react-router-dom';
import useAuth from '../contexts/auth/use-auth';

const ProtectedRoute = ({ children }) => {
	const { user, fetchingUser } = useAuth();
	if (fetchingUser) {
		return null;
	}
	return user ? children : <Navigate to="/sign-in" replace />;
};

export default ProtectedRoute;
