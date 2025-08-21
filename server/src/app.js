const express = require('express');
const cors = require('cors');
const middleware = require('./utils/middleware');
const usersRouter = require('./controllers/users');
const signUpRouter = require('./controllers/sign-up');

const app = express();

app.use(express.json());
app.use(cors());
app.use(middleware.requestLogger);

app.use('/api/users', usersRouter);
app.use('/api/sign-up', signUpRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
