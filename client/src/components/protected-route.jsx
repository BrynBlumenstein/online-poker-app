import { Navigate } from 'react-router-dom';
import useAuth from '../contexts/auth/use-auth';

const ProtectedRoute = ({ children }) => {
	const { user } = useAuth();

	return user ? children : <Navigate to="/sign-in" replace />;
};

export default ProtectedRoute;
