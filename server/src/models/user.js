const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

const User = sequelize.define(
	'User',
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		password_hash: {
			type: DataTypes.STRING,
			allowNull: false
		},
		winnings: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
			defaultValue: 0.00
		},
		hands_won: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
			validate: { min: 0 }
		}
	},
	{
		underscored: true,
		timestamps: false,
		modelName: 'user'
	}
);


module.exports = User;
