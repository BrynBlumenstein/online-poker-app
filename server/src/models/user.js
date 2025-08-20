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
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: true,
			unique: true
		},
		password_hash: {
			type: DataTypes.STRING,
			allowNull: false
		}
	},
	{
		underscored: true,
		timestamps: false,
		modelName: 'user'
	}
);

User.sync();

module.exports = User;
