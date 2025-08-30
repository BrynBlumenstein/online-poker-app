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

export default { signUp, signIn };
