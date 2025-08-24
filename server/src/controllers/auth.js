const authRouter = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const logger = require('../utils/logger');
const config = require('../utils/config');
const validateCredentials = require('../utils/validate-credentials');

const ONE_DAY = 60 * 60 * 24;

const returnError = (res, status, message) => {
	logger.error(message);
	return res.status(status).json({ error: message });
};

authRouter.post('/sign-up', async (req, res) => {
	const credentials = req.body;

	const validCredentials = validateCredentials(credentials);
	if (!validCredentials) {
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

	const { password_hash, ...userWithoutPassword } = user.toJSON();
	res.status(201).json(userWithoutPassword);
});

authRouter.post('/sign-in', async (req, res) => {
	const credentials = req.body;

	const validCredentials = validateCredentials(credentials);
	if (!validCredentials) {
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

	res.status(200).json({ token, username: user.username, id: user.id });
});

authRouter.get('/me', async (req, res) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return returnError(res, 401, 'Missing or invalid token');
	}

	const token = authHeader.split(' ')[1];

	try {
		const decoded = jwt.verify(token, config.SECRET);
		const user = await User.findOne({ where: { id: decoded.id } });

		if (!user) {
			return returnError(res, 404, 'User not found');
		}

		res.status(200).json({ username: user.username, id: user.id });
	} catch (err) {
		returnError(res, 401, 'Invalid token');
	}
});

module.exports = authRouter;
