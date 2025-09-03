const MAX_PLAYERS = 9;
const THIRTY_SECONDS = 30000;

const tables = new Map();
const disconnectTimers = new Map();

const generateTableId = () => {
	let id;
	do {
		id = Math.random().toString(36).slice(2, 8).toUpperCase();
	} while (tables.get(id));
	return id;
};

const hostTable = (socketId, userId, username) => {
	const currentTable = getCurrentTable(userId);
	if (currentTable) {
		return { success: false, error: 'You are already in a table' };
	}

	const id = generateTableId();

	const table = {
		id,
		players: new Map(),
		/*handActive: false,*/
		pot: 0,
		/*sidePots: [],
		blindAmounts: [1, 2],
		smallBlindId: null,
		bigBlindId: null,*/
		currentPlayerId: null,
		currentBet: 0,
		minRaise: 0 /*,
		deck: [],
		boardCards: [],
		bettingRound: null,
		winners: [] */
	};

	const player = {
		userId,
		username,
		socketIds: new Set(),
		hasBoughtIn: false,
		stack: null /*,
		inHand: false,
		holeCards: null,
		currentBet: 0,
		isAllIn: false */
	};
	table.players.set(userId, player);
	player.socketIds.add(socketId);

	tables.set(id, table);

	return { success: true, table };
};

const joinTable = (socketId, userId, username, tableId) => {
	const currentTable = getCurrentTable(userId);
	if (currentTable) {
		return { success: false, error: 'You are already in a table' };
	}

	const table = tables.get(tableId);
	if (!table) {
		return { success: false, error: 'Table not found' };
	}

	if (table.players.size >= MAX_PLAYERS) {
		return { success: false, error: 'Table full' };
	}

	const player = {
		userId,
		username,
		socketIds: new Set(),
		hasBoughtIn: false,
		stack: null,
		inHand: false,
		holeCards: null,
		currentBet: 0,
		isAllIn: false
	};
	table.players.set(userId, player);
	player.socketIds.add(socketId);

	if (disconnectTimers.has(userId)) {
		clearTimeout(disconnectTimers.get(userId));
		disconnectTimers.delete(userId);
	}

	return { success: true, table };
};

const leaveTable = (userId, tableId) => {
	const table = tables.get(tableId);
	if (!table) {
		return { success: false, error: 'Table not found' };
	}

	const player = table.players.get(userId);
	if (!player) {
		return { success: false, error: 'Player not in table' };
	}

	if (disconnectTimers.has(userId)) {
		clearTimeout(disconnectTimers.get(userId));
		disconnectTimers.delete(userId);
	}

	table.players.delete(userId);

	if (table.players.size === 0) {
		tables.delete(tableId);
	}

	return { success: true, table };
};

const handleSocketDisconnect = (io, socket) => {
	const { socketId, userId, username } = socket;

	const table = getCurrentTable(userId);
	if (!table) {
		return;
	}

	const player = table.players.get(userId);

	if (!player.socketIds.has(socketId)) {
		return;
	}

	player.socketIds.delete(socketId);

	if (player.socketIds.size > 0) {
		return;
	}

	const gracePeriod = THIRTY_SECONDS;

	const timeoutId = setTimeout(() => {
		const stillTable = getCurrentTable(userId);
		if (!stillTable) {
			return;
		}

		const stillPlayer = stillTable.players.get(userId);
		if (!stillPlayer || stillPlayer.socketIds.size > 0) {
			return;
		}

		stillTable.players.delete(userId);
		disconnectTimers.delete(userId);

		socket.to(stillTable.id).emit('playerLeft', `${username} left`);
		io.to(stillTable.id).emit('tableUpdated', stillTable);
	}, gracePeriod);

	disconnectTimers.set(userId, timeoutId);
};

const getCurrentTable = (userId) => {
	for (const table of tables.values()) {
		if (table.players.has(userId)) {
			return table;
		}
	}
	return null;
};

const addSocketToPlayer = (table, socketId, userId) => {
	const player = table.players.get(userId);
	player.socketIds.add(socketId);
};

const buyIn = (userId, amount) => {
	const table = getCurrentTable(userId);
	if (!table) {
		return { success: false, error: 'Table not found' };
	}

	const player = table.players.get(userId);

	player.stack = amount;
	player.hasBoughtIn = true;

	return { success: true, table };
};

module.exports = {
	hostTable,
	joinTable,
	leaveTable,
	handleSocketDisconnect,
	getCurrentTable,
	addSocketToPlayer,
	buyIn
};
