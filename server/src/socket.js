const logger = require('./utils/logger');
const tablesService = require('./services/tables-service');

const handleConnection = (socket) => {
	const currentTable = tablesService.getCurrentTable(socket.userId);

	if (currentTable) {
		tablesService.addSocketToPlayer(currentTable, socket.id, socket.userId);

		socket.join(currentTable.id);
	}

    logger.info(`Socket ${socket.id} for ${socket.username} connected`);
};

const handleGetCurrentTable = (socket) => {
	socket.emit('currentTable', tablesService.getCurrentTable(socket.userId));
};

const handleHostTable = (io, socket, ack) => {
	const result = tablesService.hostTable(
		socket.id,
		socket.userId,
		socket.username
	);

	if (!result.success) {
		ack({ error: result.error });
		return;
	}

	const table = result.table;

	socket.join(table.id);
	io.to(table.id).emit('tableUpdated', table);

    logger.info(`${socket.username} hosted table ${table.id}`);
	ack({ ok: true });
};

const handleJoinTable = (io, socket, tableId, ack) => {
	const normalizedTableId = tableId.toUpperCase();

	const result = tablesService.joinTable(
		socket.id,
		socket.userId,
		socket.username,
		normalizedTableId
	);
	if (!result.success) {
		ack({ error: result.error });
		return;
	}

	socket.join(normalizedTableId);
	socket
		.to(normalizedTableId)
		.emit('playerJoined', `${socket.username} joined`);
	io.to(normalizedTableId).emit('tableUpdated', result.table);

    logger.info(`${socket.username} joined table ${result.table.id}`);
	ack({ ok: true });
};

const handleLeaveTable = (io, socket, tableId, ack) => {
	const result = tablesService.leaveTable(socket.userId, tableId);
	if (!result.success) {
		ack({ error: result.error });
		return;
	}

	const playerSockets = [...socket.server.sockets.sockets.values()].filter(
		(s) => s.userId === socket.userId
	);

	for (const s of playerSockets) {
		s.leave(tableId);
	}

	socket.to(tableId).emit('playerLeft', `${socket.username} left`);
	io.to(tableId).emit('tableUpdated', result.table);

    logger.info(`${socket.username} left table ${tableId}`);
	ack({ ok: true });
};

const handleSignOut = (io, socket) => {
	const playerSockets = [...socket.server.sockets.sockets.values()].filter(
		(s) => s.userId === socket.userId
	);

	const currentTable = tablesService.getCurrentTable(socket.userId);
	if (currentTable) {
		const result = tablesService.leaveTable(socket.userId, currentTable.id);

		for (const s of playerSockets) {
			s.leave(currentTable.id);
		}

        socket.to(currentTable.id).emit('playerLeft', `${socket.username} left`);

		io.to(currentTable.id).emit('tableUpdated', result.table);
	}

	for (const s of playerSockets) {
		s.disconnect(true);
	}

    logger.info(`${socket.username} signed out`);
};

const handleDisconnect = (io, socket) => {
	tablesService.handleSocketDisconnect(io, socket);
    logger.info(`Socket ${socket.id} for ${socket.username} disconnected`);
};

const registerSocketHandlers = (io) => {
	io.on('connection', (socket) => {
		handleConnection(socket);

		socket.on('getCurrentTable', () => handleGetCurrentTable(socket));

		socket.on('hostTable', (ack) => handleHostTable(io, socket, ack));

		socket.on('joinTable', (tableId, ack) =>
			handleJoinTable(io, socket, tableId, ack)
		);

		socket.on('leaveTable', (tableId, ack) =>
			handleLeaveTable(io, socket, tableId, ack)
		);

		socket.on('signOut', () => handleSignOut(io, socket));

		socket.on('disconnect', () => handleDisconnect(io, socket));
	});
};

module.exports = registerSocketHandlers;
