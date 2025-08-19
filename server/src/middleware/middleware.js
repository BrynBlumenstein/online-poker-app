/**
 * Express middleware for routing and error handling
 */

const unknownEndpoint = (req, res) => {
	res.status(404).json({ error: true, message: 'unknown endpoint' });
};

const errorHandler = (err, req, res, next) => {
	let statusCode = 500;
	let message = 'An unexpected error occurred.';

	if (err.name === 'SequelizeConnectionError') {
		statusCode = 503;
		message = 'Could not connect to the database';
	} else if (err.name === 'SequelizeAuthenticationError') {
		statusCode = 401;
		message = 'Invalid database credentials.';
	}

	res.status(statusCode).json({ error: true, message });
};

module.exports = { unknownEndpoint, errorHandler };
