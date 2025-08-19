/**
 * Configures and sets up the Express application including middleware for request handling and routing for API endpoints.
 */

const express = require('express');
const cors = require('cors');
const middleware = require('./middleware/middleware');

const app = express();

app.use(express.json());
app.use(cors());

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
