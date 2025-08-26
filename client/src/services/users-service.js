import axios from 'axios';
import { throwError } from './services-utils';
const baseUrl = 'http://localhost:3001/api/users';

const updateBalance = async (newBalance, token) => {
	try {
		const response = await axios.patch(
			`${baseUrl}/balance`,
			{ balance: newBalance },
			{ headers: { Authorization: `Bearer ${token}` } }
		);
		return response.data;
	} catch (err) {
		throwError(err, 'Failed to update balance');
	}
};

export default { updateBalance };
