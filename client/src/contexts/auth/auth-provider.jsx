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

	const updateUsername = async (newUsername) => {
		const token = tokenService.get();
		const updatedUser = await usersService.updateUsername(
			newUsername,
			token
		);
		updateUser({ username: updatedUser.username });
		return updatedUser;
	};

	const updateBalance = async (newBalance) => {
		const token = tokenService.get();
		const updatedUser = await usersService.updateBalance(newBalance, token);
		updateUser({ balance: updatedUser.balance });
		return updatedUser;
	};

	const unfollowUser = async (followingId) => {
		const token = tokenService.get();
		const response = await usersService.unfollowUser(followingId, token);
		return response;
	};

	const followUser = async (followingId) => {
		const token = tokenService.get();
		const followedUser = await usersService.followUser(followingId, token);
		return followedUser;
	};

	const getAllUsers = async () => {
		const token = tokenService.get();
		const allUsers = await usersService.getAllUsers(token);
		return allUsers;
	};

	const getFollowing = async () => {
		const token = tokenService.get();
		const following = await usersService.getFollowing(token);
		return following;
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				fetchingUser,
				signUp,
				signIn,
				signOut,
				updateUsername,
				updateBalance,
				unfollowUser,
				followUser,
				getAllUsers,
				getFollowing
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
