import axios from 'axios';
const baseUrl = 'http://localhost:3001/api/auth';

const handleError = (err, action) => {
	console.error(
		`${action} failed:`,
		err.response?.status,
		err.response?.data
	);
	return err.response?.data?.error;
};

const postRequest = async (endpoint, data, action) => {
	try {
		const response = await axios.post(`${baseUrl}/${endpoint}`, data);
		return response.data;
	} catch (err) {
		return handleError(err, action);
	}
};

const signUp = (credentials) => postRequest('sign-up', credentials, 'Sign-up');

const signIn = (credentials) => postRequest('sign-in', credentials, 'Sign-in');

const getCurrentUser = async (token) => {
	try {
		const response = await axios.get(`${baseUrl}/me`, {
			headers: { Authorization: `Bearer ${token}` }
		});
		return response.data;
	} catch (err) {
		return handleError(err, 'Fetching current user');
	}
};

export default { signUp, signIn, getCurrentUser };
