import axios from 'axios';
import { throwError } from './services-utils';
const baseUrl = 'http://localhost:3001/api/tables';

const postRequest = async (endpoint, body, token) => {
	const response = await axios.post(`${baseUrl}/${endpoint}`, body, {
		headers: { Authorization: `Bearer ${token}` }
	});
	return response.data;
};

const hostTable = async (token) => {
	try {
		return await postRequest('', null, token);
	} catch (err) {
		throwError(err, 'Failed to host table');
	}
};

const joinTable = async (tableId, token) => {
	try {
		return await postRequest('join', { tableId }, token);
	} catch (err) {
		throwError(err, 'Failed to join table');
	}
};

const leaveTable = async (tableId, token) => {
	try {
		return await postRequest('leave', { tableId }, token);
	} catch (err) {
		throwError(err, 'Failed to leave table');
	}
};

const getCurrentTable = async (token) => {
	try {
		const response = await axios.get(`${baseUrl}/current`, {
			headers: { Authorization: `Bearer ${token}` }
		});
		return response.data;
	} catch (err) {
		throwError(err, 'Fetching current table failed');
	}
};

export default { hostTable, joinTable, leaveTable, getCurrentTable };
