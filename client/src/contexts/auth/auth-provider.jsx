import { useEffect, useState } from 'react';
import AuthContext from './auth-context';
import authService from '../../features/auth/auth-service';

const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [fetchingUser, setFetchingUser] = useState(true);

	const fetchUser = async () => {
		const token = localStorage.getItem('token');
		if (token) {
			try {
				const userData = await authService.getCurrentUser(token);
				if (userData && userData.username) {
					setUser(userData);
				} else {
					localStorage.removeItem('token');
				}
			} catch (err) {
				console.error('Invalid token', err);
				localStorage.removeItem('token');
			}
		}
		setFetchingUser(false);
	};

	useEffect(() => {
		fetchUser();
	}, []);

	const signIn = (token, userData) => {
		setUser(userData);
		localStorage.setItem('token', token);
	};

	const signOut = () => {
		setUser(null);
		localStorage.removeItem('token');
	};

	return (
		<AuthContext.Provider value={{ user, fetchingUser, signIn, signOut }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
