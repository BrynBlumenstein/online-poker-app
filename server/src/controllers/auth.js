const authRouter = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const logger = require('../utils/logger');
const config = require('../utils/config');
const validateCredentials = require('../utils/validate-credentials');

const ONE_DAY = 60 * 60 * 24;

authRouter.post('/sign-up', async (req, res) => {
	const credentials = req.body;

	let failureMessage = validateCredentials(credentials);
	if (failureMessage) {
		logger.info(failureMessage);
		return res.status(400).json({ error: failureMessage });
	}

	const existingUser = await User.findOne({
		where: { username: credentials.username }
	});
	if (existingUser) {
		failureMessage = 'Username already taken';
		logger.info(failureMessage);
		return res.status(400).json({ error: failureMessage });
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

	let failureMessage = validateCredentials(credentials);
	if (failureMessage) {
		logger.info(failureMessage);
		return res.status(400).json({ error: 'Invalid username or password' });
	}

	const user = await User.findOne({
		where: { username: credentials.username }
	});
	const passwordCorrect = !user
		? false
		: await bcrypt.compare(credentials.password, user.password_hash);

	if (!(user && passwordCorrect)) {
		return res.status(401).json({ error: 'Invalid username or password' });
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
		return res.status(401).json({ error: 'Missing or invalid token' });
	}

	const token = authHeader.split(' ')[1];

	try {
		const decoded = jwt.verify(token, config.SECRET);
		const user = await User.findOne({ where: { id: decoded.id } });

		if (!user) return res.status(404).json({ error: 'User not found' });

		res.json({ username: user.username, id: user.id });
	} catch (err) {
		return res.status(401).json({ error: 'Invalid token' });
	}
});

module.exports = authRouter;
