const isValidUsername = (username) => {
	const regex = /^[a-zA-Z0-9_]{3,15}$/;
	if (!username || typeof username !== 'string' || !regex.test(username)) {
		return false;
	}

	return true;
};

const isValidPassword = (password) => {
	const regex =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
	if (!password || typeof password !== 'string' || !regex.test(password)) {
		return false;
	}

	return true;
};

const validateCredentials = (credentials) => {
	if (!credentials || Object.keys(credentials).length === 0) return 'Credentials missing.';
	if (!isValidUsername(credentials.username)) return `Invalid username.`;
	if (!isValidPassword(credentials.password)) return `Invalid password.`;
	return null;
}

module.exports = validateCredentials;