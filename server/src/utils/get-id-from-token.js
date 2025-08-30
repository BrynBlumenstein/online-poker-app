const jwt = require('jsonwebtoken');
const config = require('../utils/config');

const getIdFromToken = (req, res) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		throw new Error('Missing or invalid token');
	}

	const token = authHeader.split(' ')[1];
	const decoded = jwt.verify(token, config.SECRET);

	return decoded.id;
};

module.exports = getIdFromToken;
