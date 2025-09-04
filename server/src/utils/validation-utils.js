const hasExactKeys = (obj, expectedKeys) => {
	if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
		return false;
	}
	const keys = Object.keys(obj);
	return (
		keys.length === expectedKeys.length &&
		expectedKeys.every((key) => keys.includes(key))
	);
};

const isValidUsername = (username) => {
	if (typeof username !== 'string') {
		return false;
	}
	return /^[a-zA-Z0-9_]{3,15}$/.test(username);
};

const isValidPassword = (password) => {
	if (typeof password !== 'string') {
		return false;
	}
	return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/.test(
		password
	);
};

const isValidId = (id) => {
	if (typeof id !== 'string') {
		return false;
	}
	return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
		id
	);
};

const isValidCredentials = (credentials) => {
	if (!hasExactKeys(credentials, ['username', 'password'])) {
		return false;
	}
	return (
		isValidUsername(credentials.username) &&
		isValidPassword(credentials.password)
	);
};

const isValidUsernameUpdate = (obj) => {
	if (!hasExactKeys(obj, ['username'])) {
		return false;
	}
	return isValidUsername(obj.username);
}

const isValidFollowingUpdate = (obj) => {
	if (!hasExactKeys(obj, ['following_id'])) {
		return false;
	}
	return isValidId(obj.following_id);
}

const isValidTableId = (id) => {
	if (typeof id !== 'string') {
		return false;
	}
	return /^[A-Z0-9]{6}$/i.test(id);
}

const isValidTableRequest = (obj) => {
	if (!hasExactKeys(obj, ['tableId'])) {
		return false;
	}
	return isValidTableId(obj.tableId);
}

module.exports = {
	isValidId,
	isValidCredentials,
	isValidUsernameUpdate,
	isValidFollowingUpdate,
	isValidTableRequest
};
