const express = require('express');
const cors = require('cors');
const middleware = require('./utils/middleware');
const usersRouter = require('./controllers/users');
const authRouter = require('./controllers/auth');

const app = express();

app.use(express.json());
app.use(cors());
// app.use(middleware.requestLogger);

app.use('/api/auth', authRouter);

app.use(middleware.auth);

app.use('/api/users', usersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
