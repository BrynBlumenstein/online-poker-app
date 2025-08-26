import axios from 'axios';
import { throwError } from './services-utils';
const baseUrl = 'http://localhost:3001/api/users';

const patchRequest = async (endpoint, body, token) => {
	const response = await axios.patch(`${baseUrl}/${endpoint}`, body, {
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

export default { updateBalance, updateUsername };
