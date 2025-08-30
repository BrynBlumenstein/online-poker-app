const getIdFromToken = require('./get-id-from-token');
const logger = require('./logger');
const returnError = require('./return-error');

const requestLogger = (req, res, next) => {
	logger.info('Method:', req.method);
	logger.info('Path:  ', req.path);
	logger.info('Body:  ', req.body);
	logger.info('---');
	next();
};

const auth = (req, res, next) => {
	try {
		const userId = getIdFromToken(req, res);
		req.userId = userId;
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
