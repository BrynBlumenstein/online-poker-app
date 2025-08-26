const User = require('../models/user');
const returnError = require('../utils/return-error');
const {
	isValidBalanceUpdate,
	isValidUsernameUpdate
} = require('../utils/validation-utils');
const getIdFromToken = require('../utils/get-id-from-token');
const usersRouter = require('express').Router();

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

usersRouter.patch('/balance', async (req, res) => {
	const id = getIdFromToken(req, res);
	if (!id) {
		return;
	}

	if (!isValidBalanceUpdate(req.body)) {
		return returnError(res, 404, 'Invalid request body');
	}

	const balance = req.body.balance;

	const user = await User.findByPk(id);
	if (!user) {
		return returnError(res, 404, 'User not found');
	}

	try {
		user.balance = balance;
		await user.save();
		const { password_hash, ...userData } = user.toJSON();
		return res.status(200).json(userData);
	} catch (err) {
		returnError(res, 500, 'Failed to update balance');
	}
});

usersRouter.patch('/username', async (req, res) => {
	const id = getIdFromToken(req, res);
	if (!id) {
		return;
	}

	if (!isValidUsernameUpdate(req.body)) {
		return returnError(res, 404, 'Invalid request body');
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

module.exports = usersRouter;
