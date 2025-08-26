import axios from 'axios';
import { throwError } from './services-utils';
const baseUrl = 'http://localhost:3001/api/auth';

const postRequest = async (endpoint, data) => {
	const response = await axios.post(`${baseUrl}/${endpoint}`, data);
	return response.data;
};

const signUp = async (credentials) => {
	try {
		return await postRequest('sign-up', credentials);
	} catch (err) {
		throwError(err, 'Sign-up failed');
	}
};

const signIn = async (credentials) => {
	try {
		return await postRequest('sign-in', credentials);
	} catch (err) {
		throwError(err, 'Sign-in failed');
	}
};

const getCurrentUser = async (token) => {
	try {
		const response = await axios.get(`${baseUrl}/me`, {
			headers: { Authorization: `Bearer ${token}` }
		});
		return response.data;
	} catch (err) {
		throwError(err, 'Fetching current user failed');
	}
};

export default { signUp, signIn, getCurrentUser };
