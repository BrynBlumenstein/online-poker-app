const isValidUsername = (username) => {
	return /^[a-zA-Z0-9_]{3,15}$/.test(username);
};

const isValidPassword = (password) => {
	return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/.test(
		password
	);
};

const isValidCredentials = (credentials) => {
	if (typeof credentials !== 'object' || credentials === null || Array.isArray(credentials)) {
        return false;
    }

	const keys = Object.keys(credentials);
    if (keys.length !== 2 || !keys.includes('username') || !keys.includes('password')) {
        return false;
    }

	const { username, password } = credentials;
	
	if (typeof username !== 'string' || typeof password !== 'string') {
        return false;
    }

	return isValidUsername(username) && isValidPassword(password);
};

const isValidId = (id) => {
	if (typeof id !== 'string') return false;
	
	const uuidRegex =
		/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

	return uuidRegex.test(id);
};

function isValidBalanceUpdate(obj) {
	if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
		return false;
	}

	const keys = Object.keys(obj);
	if (keys.length !== 1 || keys[0] !== 'balance') {
		return false;
	}

	const value = obj.balance;

	if (typeof value !== 'number') {
		return false;
	}
	if (!Number.isInteger(value)) {
		return false;
	}
	if (value < 0) {
		return false;
	}

	return true;
}

module.exports = { isValidCredentials, isValidId, isValidBalanceUpdate };
