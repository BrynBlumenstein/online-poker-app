const User = require('./user');
const Follow = require('./follow');

User.belongsToMany(User, {
	as: 'Following',
	through: Follow,
	foreignKey: 'follower_id',
	otherKey: 'following_id'
});

module.exports = { User, Follow };
