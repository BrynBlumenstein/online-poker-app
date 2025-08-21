const User = require('../models/user');
const signUpRouter = require('express').Router();
const validateCredentials = require('../utils/validate-credentials');
const logger = require('../utils/logger');
const bcrypt = require('bcrypt');

signUpRouter.post('/', async (req, res) => {
	const credentials = req.body;

	let failureMessage = validateCredentials(credentials);
	if (failureMessage) {
		logger.info(failureMessage);
		return res.status(400).json({ error: failureMessage });
	}

	const existingUser = await User.findOne({ username: credentials.username });
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

module.exports = signUpRouter;
