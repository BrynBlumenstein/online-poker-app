const { User } = require('../models/index');
const returnError = require('../utils/return-error');
const {
	isValidUsernameUpdate,
	isValidFollowingUpdate
} = require('../utils/validation-utils');
const usersRouter = require('express').Router();

usersRouter.patch('/username', async (req, res) => {
	const id = req.userId;

	if (!isValidUsernameUpdate(req.body)) {
		return returnError(res, 400, 'Invalid request body');
	}

	const username = req.body.username;

	const user = await User.findByPk(id);
	if (!user) {
		return returnError(res, 404, 'User not found');
	}

	const existingUser = await User.findOne({
		where: { username: username }
	});
	if (existingUser) {
		return returnError(res, 400, 'Username already taken');
	}

	try {
		user.username = username;
		await user.save();
		const { password_hash, ...userData } = user.toJSON();
		return res.status(200).json(userData);
	} catch (err) {
		returnError(res, 500, 'Failed to update username');
	}
});

usersRouter.get('/', async (req, res) => {
	const users = await User.findAll();

	if (!users) {
		return returnError(res, 404, 'Failed to fetch users');
	}

	const returnedUsers = users.map((user) => {
		const { password_hash, ...userData } = user.toJSON();
		return userData;
	});

	res.status(200).json(returnedUsers);
});

usersRouter.get('/following', async (req, res) => {
	const id = req.userId;

	const user = await User.findByPk(id);
	if (!user) {
		return returnError(res, 404, 'User not found');
	}

	const following = await user.getFollowing();

	res.status(200).json(following);
});

usersRouter.post('/following', async (req, res) => {
	const id = req.userId;

	if (!isValidFollowingUpdate(req.body)) {
		return returnError(res, 400, 'Invalid request body');
	}

	const follower = await User.findByPk(id);
	const following = await User.findByPk(req.body.following_id);
	if (!follower || !following) {
		return returnError(res, 404, 'User not found');
	}

	try {
		await follower.addFollowing(following);

		res.status(201).json(following);
	} catch (err) {
		if (err.name === 'SequelizeUniqueConstraintError') {
			return returnError(res, 409, 'Already following this user');
		}
		return returnError(res, 500, 'Failed to follow user');
	}
});

usersRouter.delete('/following', async (req, res) => {
	const id = req.userId;

	if (!isValidFollowingUpdate(req.body)) {
		return returnError(res, 400, 'Invalid request body');
	}

	const follower = await User.findByPk(id);
	const following = await User.findByPk(req.body.following_id);
	if (!follower || !following) {
		return returnError(res, 404, 'User not found');
	}

	try {
		const unfollowed = await follower.removeFollowing(following);

		if (unfollowed === 0) {
			return returnError(res, 400, 'You are not following this user');
		}
		
		res.status(200).json({ message: 'Unfollow successful' });
	} catch (err) {
		return returnError(res, 500, 'Failed to unfollow user');
	}
});

usersRouter.get('/me', async (req, res) => {
	const id = req.userId;

	const user = await User.findByPk(id);
	if (!user) {
		return returnError(res, 404, 'User not found');
	}

	const { password_hash, ...userData } = user.toJSON();
	res.status(200).json(userData);
});

module.exports = usersRouter;
