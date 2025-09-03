const logger = require('./utils/logger');
const tablesService = require('./services/tables-service');

const handleConnection = (socket) => {
	logger.info(`Socket ${socket.id} for ${socket.username} connected`);

	const table = tablesService.getCurrentTable(socket.userId);

	if (table) {
		tablesService.addSocketToPlayer(table, socket.id, socket.userId);

		socket.join(table.id);
		logger.info(
			`Socket ${socket.id} for ${socket.username} joined room ${table.id}`
		);
	}
};

const handleGetCurrentTable = (socket) => {
	const table = tablesService.getCurrentTable(socket.userId);
	socket.emit(
		'currentTable',
		table
			? {
					...table,
					players: Object.fromEntries(table.players)
			  }
			: null
	);
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
	logger.info(
		`Socket ${socket.id} for ${socket.username} joined room ${table.id}`
	);

	io.to(table.id).emit('tableUpdated', {
		...table,
		players: Object.fromEntries(table.players)
	});

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
	logger.info(
		`Socket ${socket.id} for ${socket.username} joined room ${normalizedTableId}`
	);

	socket
		.to(normalizedTableId)
		.emit('playerJoined', `${socket.username} joined`);
	io.to(normalizedTableId).emit('tableUpdated', {
		...result.table,
		players: Object.fromEntries(result.table.players)
	});

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
	io.to(tableId).emit('tableUpdated', {
		...result.table,
		players: Object.fromEntries(result.table.players)
	});

	logger.info(`${socket.username} left table ${tableId}`);
	ack({ ok: true });
};

const handleSignOut = (io, socket) => {
	const playerSockets = [...socket.server.sockets.sockets.values()].filter(
		(s) => s.userId === socket.userId
	);

	const table = tablesService.getCurrentTable(socket.userId);
	if (table) {
		const result = tablesService.leaveTable(socket.userId, table.id);

		for (const s of playerSockets) {
			s.leave(table.id);
		}

		socket.to(table.id).emit('playerLeft', `${socket.username} left`);

		io.to(table.id).emit('tableUpdated', {
			...result.table,
			players: Object.fromEntries(result.table.players)
		});
	}

	for (const s of playerSockets) {
		s.disconnect(true);
	}

	logger.info(`${socket.username} signed out`);
};

const handleBuyIn = (io, socket, amount, ack) => {
	const result = tablesService.buyIn(socket.userId, amount);
	if (!result.success) {
		ack({ error: result.error });
		return;
	}

	socket
		.to(result.table.id)
		.emit('playerBoughtIn', `${socket.username} bought in for $${amount}`);
	io.to(result.table.id).emit('tableUpdated', {
		...result.table,
		players: Object.fromEntries(result.table.players)
	});

	logger.info(`${socket.username} bought in for $${amount}`);
	ack({ ok: true });
};

const handleFold = (io, socket, ack) => {
	const result = tablesService.fold(socket.userId);
	if (!result.success) {
		ack({ error: result.error });
		return;
	}

	socket
		.to(result.table.id)
		.emit('playerFolded', `${socket.username} folded`);
	io.to(result.table.id).emit('tableUpdated', {
		...result.table,
		players: Object.fromEntries(result.table.players)
	});

	logger.info(`${socket.username} folded`);
	ack({ ok: true });
};

const handleCall = (io, socket, ack) => {
	const result = tablesService.call(socket.userId);
	if (!result.success) {
		ack({ error: result.error });
		return;
	}

	socket
		.to(result.table.id)
		.emit('playerCalled', `${socket.username} called`);
	io.to(result.table.id).emit('tableUpdated', {
		...result.table,
		players: Object.fromEntries(result.table.players)
	});

	logger.info(`${socket.username} called`);
	ack({ ok: true });
};

const handleRaise = (io, socket, amount, ack) => {
	const result = tablesService.call(socket.userId, amount);
	if (!result.success) {
		ack({ error: result.error });
		return;
	}

	socket
		.to(result.table.id)
		.emit('playerRaised', `${socket.username} raised to $${amount}`);
	io.to(result.table.id).emit('tableUpdated', {
		...result.table,
		players: Object.fromEntries(result.table.players)
	});

	logger.info(`${socket.username} raised to $${amount}`);
	ack({ ok: true });
};

const handleAllIn = (io, socket, amount, ack) => {
	const result = tablesService.allIn(socket.userId, amount);
	if (!result.success) {
		ack({ error: result.error });
		return;
	}

	socket
		.to(result.table.id)
		.emit('playerWentAllIn', `${socket.username} went all in for $${amount}`);
	io.to(result.table.id).emit('tableUpdated', {
		...result.table,
		players: Object.fromEntries(result.table.players)
	});

	logger.info(`${socket.username} went all in for $${amount}`);
	ack({ ok: true });
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

		socket.on('buyIn', (amount, ack) =>
			handleBuyIn(io, socket, amount, ack)
		);

		socket.on('fold', (ack) =>
			handleFold(io, socket, ack)
		);

		socket.on('call', (ack) =>
			handleCall(io, socket, ack)
		);

		socket.on('raise', (amount, ack) =>
			handleRaise(io, socket, amount, ack)
		);

		socket.on('allIn', (amount, ack) =>
			handleAllIn(io, socket, amount, ack)
		);

		socket.on('disconnect', () => handleDisconnect(io, socket));
	});
};

module.exports = registerSocketHandlers;
