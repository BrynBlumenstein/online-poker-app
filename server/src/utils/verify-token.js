const jwt = require('jsonwebtoken');
const config = require('./config');

const verifyToken = (token) => {
	const decoded = jwt.verify(token, config.SECRET);
	return decoded;
};

module.exports = verifyToken;
