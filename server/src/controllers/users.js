const User = require('../models/user');
const usersRouter = require('express').Router();

usersRouter.get('/', async (req, res) => {
	const users = await User.findAll();
	if (users) {
		res.json(users);
	} else {
		res.status(404).end();
	}
});

module.exports = usersRouter;
