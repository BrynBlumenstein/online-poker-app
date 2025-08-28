const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

const Follow = sequelize.define(
	'Follow',
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true
		},
		follower_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'users',
				key: 'id'
			},
			onDelete: 'CASCADE'
		},
		following_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'users',
				key: 'id'
			},
			onDelete: 'CASCADE'
		}
	},
	{
		underscored: true,
		timestamps: false,
		modelName: 'follow',
		indexes: [
			{
				unique: true,
				fields: ['follower_id', 'following_id']
			}
		]
	}
);

module.exports = Follow;
