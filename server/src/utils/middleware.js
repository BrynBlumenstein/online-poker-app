const logger = require('./logger');

const unknownEndpoint = (req, res) => {
	res.status(404).json({ error: true, message: 'unknown endpoint' });
};

const errorHandler = (err, req, res, next) => {
	logger.error(err.message);

	let statusCode = 500;
	let message = 'An unexpected error occurred.';

	if (err.name === 'SequelizeConnectionError') {
		statusCode = 503;
		message = 'Could not connect to the database';
	} else if (err.name === 'SequelizeAuthenticationError') {
		statusCode = 401;
		message = 'Invalid database credentials.';
	} else if (err.name === 'SequelizeValidationError') {
		statusCode = 400;
		const validationError = err.errors[0];
		if (validationError && validationError.type === 'notNull Violation') {
			message = `The field '${validationError.path}' is required.`;
		} else {
			message = validationError.message || 'Validation failed.';
		}
	} else if (err.name === 'SequelizeUniqueConstraintError') {
		statusCode = 409;
		const fieldName = Object.keys(err.fields)[0];
		message = `A user with that ${fieldName} already exists.`;
	}

	res.status(statusCode).json({ error: true, message });
};

module.exports = { unknownEndpoint, errorHandler };
