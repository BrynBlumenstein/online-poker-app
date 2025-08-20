const { Sequelize } = require('sequelize');
const config = require('./config');
const logger = require('./logger');

const sequelize = new Sequelize(config.DB_URL, {
	logging: (sql) => logger.info(sql),
	dialect: 'postgres'
});

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
