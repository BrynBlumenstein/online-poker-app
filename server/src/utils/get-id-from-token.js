const jwt = require('jsonwebtoken');
const config = require('../utils/config');
const returnError = require('../utils/return-error');

const getIdFromToken = (req, res) => {
    const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return returnError(res, 401, 'Missing or invalid token');
	}

	const token = authHeader.split(' ')[1];

	try {
		const decoded = jwt.verify(token, config.SECRET);
		return decoded.id;
	} catch (err) {
		returnError(res, 401, 'Invalid token');
	}
};

module.exports = getIdFromToken;