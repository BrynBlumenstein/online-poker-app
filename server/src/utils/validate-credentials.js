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
		return false;
	}

	if (
		!(
			isValidUsername(credentials.username) &&
			isValidPassword(credentials.password)
		)
	) {
		return false;
	}

	return true;
};

module.exports = validateCredentials;
