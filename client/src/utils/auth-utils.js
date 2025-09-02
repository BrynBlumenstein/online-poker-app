export const isValidUsername = (username) => {
	return /^[a-zA-Z0-9_]{3,15}$/.test(username);
};

export const isValidPassword = (password) => {
	return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/.test(
		password
	);
};
