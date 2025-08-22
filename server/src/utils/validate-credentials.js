const isValidUsername = (username) => {
	return /^[a-zA-Z0-9_]{3,15}$/.test(username);
};

const isValidPassword = (password) => {
	return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/.test(
		password
	);
};

const validateCredentials = (credentials) => {
	if (!credentials || Object.keys(credentials).length === 0) {
		return 'Credentials missing.';
	}

	if (!isValidUsername(credentials.username)) {
		return `Invalid username.`;
	}

	if (!isValidPassword(credentials.password)) {
		return `Invalid password.`;
	}

	return null;
};

module.exports = validateCredentials;
