import { useEffect, useState } from 'react';
import AuthContext from './auth-context';
import authService from '../../services/auth-service';

const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [fetchingUser, setFetchingUser] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			const token = localStorage.getItem('token');
			if (token) {
				try {
					const userData = await authService.getCurrentUser(token);
					setUser(userData);
				} catch (err) {
					console.error(err);
					signOut();
				}
			}
			setFetchingUser(false);
		};

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

	const updateUser = (updates) => {
		setUser((prev) => ({ ...prev, ...updates }));
	};

	return (
		<AuthContext.Provider
			value={{ user, fetchingUser, signIn, signOut, updateUser }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
