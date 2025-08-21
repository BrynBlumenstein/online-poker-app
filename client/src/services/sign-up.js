import axios from 'axios';
const baseUrl = 'http://localhost:3001/api/sign-up';

const signUp = async (credentials) => {
	try {
		const response = await axios.post(baseUrl, credentials);
		return response;
	} catch (err) {
		console.error(
			'Sign-up failed:',
			err.response?.status,
			err.response?.data
		);
		return err.response?.data;
	}
};

export default { signUp };
