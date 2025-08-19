/**
 * Establishes a connection to the PostgreSQL database
 */

const { Sequelize } = require('sequelize');

const connectToDB = async (url) => {
	const sequelize = new Sequelize(url, {
		logging: (sql) => {
			if (sql.includes('SELECT 1+1')) {
				return;
			}
			console.log(sql);
		}
	});
	await sequelize.authenticate();
	return sequelize;
};

module.exports = connectToDB;
