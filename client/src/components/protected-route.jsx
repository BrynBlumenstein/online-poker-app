import { Navigate } from 'react-router-dom';
import useAuth from '../contexts/auth/use-auth';

const ProtectedRoute = ({ children }) => {
	const { user, fetchingUser } = useAuth();
	if (fetchingUser) return <></>;
	if (!user) return <Navigate to="/sign-in" replace />;
	return children;
};

export default ProtectedRoute;
