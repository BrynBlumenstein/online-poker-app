const tablesRouter = require('express').Router();
const tablesService = require('../services/tables-service');
const returnError = require('../utils/return-error');
const { isValidTableRequest } = require('../utils/validation-utils');

tablesRouter.post('/', (req, res) => {
	const hostId = req.userId;

	try {
		const newTable = tablesService.createTable(hostId);
		res.status(201).json(newTable);
	} catch (err) {
		return returnError(res, 400, err.message);
	}
});

const handleTableAction = (actionFn) => (req, res) => {
	const playerId = req.userId;

	if (!isValidTableRequest(req.body)) {
		return returnError(res, 400, 'Invalid request body');
	}

	const table = tablesService.getTable(req.body.tableId.toUpperCase());
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

tablesRouter.get('/', (req, res) => {
	const tables = tablesService.getTables();
	res.status(200).json(tables);
});

tablesRouter.get('/current', (req, res) => {
	const playerId = req.userId;

	const currentTable = tablesService.getCurrentTable(playerId);

	res.status(200).json(currentTable);
});

module.exports = tablesRouter;
