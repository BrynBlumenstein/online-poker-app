import axios from 'axios';
import { throwError } from './services-utils';
const baseUrl = 'http://localhost:3001/api/users';

const patchRequest = async (endpoint, body, token) => {
	const response = await axios.patch(`${baseUrl}/${endpoint}`, body, {
		headers: { Authorization: `Bearer ${token}` }
	});
	return response.data;
};

const getRequest = async (endpoint, token) => {
	const response = await axios.get(`${baseUrl}/${endpoint}`, {
		headers: { Authorization: `Bearer ${token}` }
	});
	return response.data;
};

const updateBalance = async (newBalance, token) => {
	try {
		return await patchRequest('balance', { balance: newBalance }, token);
	} catch (err) {
		throwError(err, 'Failed to update balance');
	}
};

const updateUsername = async (newUsername, token) => {
	try {
		return await patchRequest('username', { username: newUsername }, token);
	} catch (err) {
		throwError(err, 'Failed to update username');
	}
};

const getAllUsers = async (token) => {
	try {
		return await getRequest('', token);
	} catch (err) {
		throwError(err, 'Failed to get all users');
	}
};

const getFollowing = async (token) => {
	try {
		return await getRequest('following', token);
	} catch (err) {
		throwError(err, 'Failed to get following');
	}
};

const followUser = async (followingId, token) => {
	try {
		const response = await axios.post(
			`${baseUrl}/following`,
			{ following_id: followingId },
			{
				headers: { Authorization: `Bearer ${token}` }
			}
		);
		return response.data;
	} catch (err) {
		throwError(err, 'Failed to follow user');
	}
};

const unfollowUser = async (followingId, token) => {
	try {
		const response = await axios.delete(`${baseUrl}/following`, {
			data: { following_id: followingId },
			headers: { Authorization: `Bearer ${token}` }
		});
		return response.data;
	} catch (err) {
		throwError(err, 'Failed to unfollow user');
	}
};

const getCurrentUser = async (token) => {
	try {
		return await getRequest('me', token);
	} catch (err) {
		throwError(err, 'Fetching current user failed');
	}
};

export default {
	updateBalance,
	updateUsername,
	getAllUsers,
	getFollowing,
	followUser,
	unfollowUser,
	getCurrentUser
};
