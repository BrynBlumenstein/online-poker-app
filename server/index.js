/**
 * Main entry point for the Node.js application.
 * Starts the server, connects to the databases, and listens for incoming requests on the configured port.
 */

const app = require('./src/app');
const config = require('./src/config/config');
const logger = require('./src/utils/logger');
const connectToDB = require('./src/db/connection');

const startServer = async () => {
	try {
		logger.info(`Connecting to ${config.DB_URL}`);
		const sequelize = await connectToDB(config.DB_URL);
		logger.info('Connection to DB established successfully.');

		app.listen(config.PORT, () => {
			logger.info(`Server running on port ${config.PORT}`);
		});
	} catch (error) {
		logger.error('Failed to start server:', error.message);
		process.exit(1);
	}
};

startServer();
