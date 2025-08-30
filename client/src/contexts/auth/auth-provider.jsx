import { useEffect, useState } from 'react';
import AuthContext from './auth-context';
import authService from '../../services/auth-service';
import usersService from '../../services/users-service';
import tokenService from '../../services/token-service';

const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [fetchingUser, setFetchingUser] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			const token = tokenService.get();
			if (token) {
				try {
					const userData = await usersService.getCurrentUser(token);
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

	const signUp = async (credentials) => {
		const user = await authService.signUp(credentials);
		return user;
	};

	const signIn = async (credentials) => {
		const { token, userData } = await authService.signIn(credentials);
		setUser(userData);
		tokenService.set(token);
	};

	const signOut = () => {
		setUser(null);
		tokenService.clear();
	};

	const updateUser = (updates) => {
		setUser((prev) => ({ ...prev, ...updates }));
	};

	return (
		<AuthContext.Provider
			value={{ user, fetchingUser, signUp, signIn, signOut, updateUser }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
