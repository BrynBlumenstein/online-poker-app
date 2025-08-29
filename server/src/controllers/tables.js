const tablesRouter = require('express').Router();
const tablesService = require('../services/tables-service');
const getIdFromToken = require('../utils/get-id-from-token');
const returnError = require('../utils/return-error');
const { isValidTableRequest } = require('../utils/validation-utils');

tablesRouter.get('/', (req, res) => {
	const tables = tablesService.getTables();
	res.status(200).json(tables);
});

tablesRouter.post('/', (req, res) => {
	const hostId = getIdFromToken(req, res);
	if (!hostId) {
		return;
	}

	try {
		const newTable = tablesService.createTable(hostId);
		res.status(201).json(newTable);
	} catch (err) {
		return returnError(res, 400, err.message);
	}
});

const handleTableAction = (actionFn) => (req, res) => {
	const playerId = getIdFromToken(req, res);
	if (!playerId) {
		return;
	}

	if (!isValidTableRequest(req.body)) {
		return returnError(res, 400, 'Invalid request body');
	}

	const table = tablesService.getTable((req.body.tableId).toUpperCase());
	if (!table) {
		return returnError(res, 404, 'Table not found');
	}

	try {
		const updatedTable = actionFn(playerId, table);
		res.status(200).json(updatedTable);
	} catch (err) {
		return returnError(res, 400, err.message);
	}
};

tablesRouter.post('/join', handleTableAction(tablesService.joinTable));

tablesRouter.post('/leave', handleTableAction(tablesService.leaveTable));

module.exports = tablesRouter;
