const logger = require('./logger');
const returnError = require('./return-error');
const verifyToken = require('./verify-token');

const requestLogger = (req, res, next) => {
	logger.info('Method:', req.method);
	logger.info('Path:  ', req.path);
	logger.info('Body:  ', req.body);
	logger.info('---');
	next();
};

const auth = (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		const message = 'Missing or invalid token';
		logger.error(message);
		return returnError(res, 401, message);
	}

	const token = authHeader.split(' ')[1];

	try {
		const user = verifyToken(token);
		req.userId = user.id;
		next();
	} catch (err) {
		logger.error(err.message);
		return returnError(res, 401, err.message);
	}
};

const unknownEndpoint = (req, res) => {
	res.status(404).json({ error: true, message: 'unknown endpoint' });
};

const errorHandler = (err, req, res, next) => {
	logger.error(err.message);
	res.status(500).json({
		error: true,
		message: 'An unexpected error occurred.'
	});
};

module.exports = { requestLogger, auth, unknownEndpoint, errorHandler };
