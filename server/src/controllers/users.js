const User = require('../models/user');
const returnError = require('../utils/return-error');
const { isValidBalanceUpdate } = require('../utils/validation-utils');
const getIdFromToken = require('../utils/get-id-from-token');
const usersRouter = require('express').Router();

usersRouter.get('/', async (req, res) => {
	const users = await User.findAll();

	if (!users) {
		return returnError(res, 404, 'Failed to fetch users');
	}

	res.json(users);
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
		return res.status(200).json({
			id: user.id,
			username: user.username,
			balance: user.balance
		});
	} catch (err) {
		returnError(res, 500, 'Failed to update balance');
	}
});

module.exports = usersRouter;
