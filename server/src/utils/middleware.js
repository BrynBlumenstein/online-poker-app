const logger = require('./logger');

const requestLogger = (req, res, next) => {
	logger.info('Method:', req.method);
	logger.info('Path:  ', req.path);
	logger.info('Body:  ', req.body);
	logger.info('---');
	next();
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

module.exports = { requestLogger, unknownEndpoint, errorHandler };
