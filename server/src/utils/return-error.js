const logger = require('../utils/logger');

const returnError = (res, status, message) => {
    logger.error(message);
    return res.status(status).json({ error: message });
};

module.exports = returnError;