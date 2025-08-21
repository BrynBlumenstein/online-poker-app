const { Sequelize } = require('sequelize');
const config = require('./config');
const logger = require('./logger');

let sequelize;

try {
	sequelize = new Sequelize(config.DB_URL, {
		logging: (sql) => logger.info(sql),
		dialect: 'postgres'
	});
} catch (err) {
	logger.error('Failed to initialize Sequelize:', err.message);
	process.exit(1);
}

const connectToDB = async () => {
	try {
		await sequelize.authenticate();
		logger.info('Successfully connected to DB.');
	} catch (err) {
		logger.error('Failed to connect to DB:', err.message);
		process.exit(1);
	}
};

module.exports = { sequelize, connectToDB };
