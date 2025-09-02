const config = require('./src/utils/config');
const logger = require('./src/utils/logger');
const { connectToDB, syncDB } = require('./src/utils/db');
const { server } = require('./src/server');

const startServer = async () => {
	try {
		logger.info(`Connecting to ${config.DB_URL}`);
		await connectToDB();

		logger.info('Syncing DB');
		await syncDB();

		server.listen(config.PORT, () => {
			logger.info(`Server running on port ${config.PORT}`);
		});
	} catch (err) {
		logger.error('Failed to start server:', err.message);
		process.exit(1);
	}
};

startServer();
