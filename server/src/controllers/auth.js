const authRouter = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../utils/config');
const { isValidCredentials } = require('../utils/validation-utils');
const returnError = require('../utils/return-error');
const getIdFromToken = require('../utils/get-id-from-token');

const ONE_DAY = 60 * 60 * 24;

authRouter.post('/sign-up', async (req, res) => {
	const credentials = req.body;

	if (!isValidCredentials(credentials)) {
		return returnError(res, 400, 'Invalid username or password');
	}

	const existingUser = await User.findOne({
		where: { username: credentials.username }
	});
	if (existingUser) {
		return returnError(res, 400, 'Username already taken');
	}

	const saltRounds = 10;
	const hashedPassword = await bcrypt.hash(credentials.password, saltRounds);

	const user = await User.create({
		username: credentials.username,
		password_hash: hashedPassword
	});

	const { password_hash, balance, earnings, hands_won, ...userData } = user.toJSON();
	res.status(201).json(userData);
});

authRouter.post('/sign-in', async (req, res) => {
	const credentials = req.body;

	if (!isValidCredentials(credentials)) {
		return returnError(res, 400, 'Invalid username or password');
	}

	const user = await User.findOne({
		where: { username: credentials.username }
	});
	const passwordCorrect = !user
		? false
		: await bcrypt.compare(credentials.password, user.password_hash);

	if (!(user && passwordCorrect)) {
		return returnError(res, 401, 'Invalid username or password');
	}

	const userForToken = {
		username: user.username,
		id: user.id
	};

	const token = jwt.sign(userForToken, config.SECRET, {
		expiresIn: ONE_DAY
	});

	const {password_hash, ...userData} = user.toJSON();
	res.status(200).json({ token, userData });
});

authRouter.get('/me', async (req, res) => {
	const id = getIdFromToken(req, res);
	if (!id) {
		return;
	}

	const user = await User.findByPk(id);
	if (!user) {
		return returnError(res, 404, 'User not found');
	}

	const {password_hash, ...userData} = user.toJSON();
	res.status(200).json(userData);
});

module.exports = authRouter;
