import axios from 'axios';
const baseUrl = 'http://localhost:3001/api';

const postRequest = async (endpoint, data, action) => {
	try {
		const response = await axios.post(`${baseUrl}/${endpoint}`, data);
		return response;
	} catch (err) {
		console.error(
			`${action} failed:`,
			err.response?.status,
			err.response?.data
		);
		return err.response?.data;
	}
};

const signUp = (credentials) => postRequest('sign-up', credentials, 'Sign-up');

const signIn = (credentials) => postRequest('sign-in', credentials, 'Sign-in');

export default { signUp, signIn };
