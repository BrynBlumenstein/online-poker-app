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
		blindAmounts: [0.25, 0.5],
		players: new Map(),
		seats: Array(MAX_PLAYERS).fill(null),
		handActive: false,
		pot: 0,
		deck: [],
		dealerIndex: 0,
		smallBlindIndex: -1,
		bigBlindIndex: -1,
		currentPlayerIndex: -1,
		minRaise: 0
	};

	const player = {
		userId,
		username,
		socketIds: new Set(),
		hasBoughtIn: false,
		stack: 0,
		inHand: false,
		holeCards: []
	};
	table.players.set(userId, player);
	table.seats[0] = userId;
	player.socketIds.add(socketId);

	tables.set(id, table);

	return { success: true, table };
};

const findNextFilledSeat = (seats, startIndex) => {
	let length = seats.length;
	if (length === 0) {
		return -1;
	}

	for (let offset = 1; offset <= length; offset++) {
		const index = (startIndex + offset) % length;
		if (seats[index] !== null) {
			return index;
		}
	}

	return -1;
};

const moveMarkers = (table, reason = null, playerIndex = null) => {
	if (table.players.size === 1) {
		table.dealerIndex = table.seats.findIndex((id) => id !== null);
		table.smallBlindIndex = -1;
		table.bigBlindIndex = -1;
		return;
	}

	if (
		reason === 'handEnded' ||
		(reason === 'playerLeft' && playerIndex === table.dealerIndex)
	) {
		table.dealerIndex = findNextFilledSeat(table.seats, table.dealerIndex);
	}

	if (table.players.size === 2) {
		table.smallBlindIndex = table.dealerIndex;
		table.bigBlindIndex = findNextFilledSeat(
			table.seats,
			table.dealerIndex
		);
	} else {
		table.smallBlindIndex = findNextFilledSeat(
			table.seats,
			table.dealerIndex
		);
		table.bigBlindIndex = findNextFilledSeat(
			table.seats,
			table.smallBlindIndex
		);
	}
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

	const seatIndex = table.seats.indexOf(null);
	if (seatIndex === -1) {
		return { success: false, error: 'No seat available' };
	}

	const player = {
		userId,
		username,
		socketIds: new Set(),
		hasBoughtIn: false,
		stack: 0,
		inHand: false,
		holeCards: []
	};
	table.players.set(userId, player);
	table.seats[seatIndex] = userId;
	player.socketIds.add(socketId);

	if (!table.handActive) {
		moveMarkers(table);
	}

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
		return { success: false, error: 'Player not at table' };
	}

	if (disconnectTimers.has(userId)) {
		clearTimeout(disconnectTimers.get(userId));
		disconnectTimers.delete(userId);
	}

	const seatIndex = table.seats.indexOf(userId);
	if (seatIndex !== -1) {
		table.seats[seatIndex] = null;
	}

	table.players.delete(userId);

	if (table.players.size === 0) {
		tables.delete(tableId);
	} else if (!table.handActive) {
		moveMarkers(table, 'playerLeft', seatIndex);
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

		const seatIndex = stillTable.seats.indexOf(userId);
		if (seatIndex !== -1) {
			table.seats[seatIndex] = null;
		}

		stillTable.players.delete(userId);
		disconnectTimers.delete(userId);

		if (stillTable.players.size === 0) {
			tables.delete(stillTable.id);
			return;
		}

		if (!stillTable.handActive) {
			moveMarkers(stillTable, 'playerLeft', seatIndex);
		}

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

const fold = (userId) => {
	const table = getCurrentTable(userId);
	if (!table) {
		return { success: false, error: 'Table not found' };
	}

	const player = table.players.get(userId);

	// TODO

	return { success: true, table };
};

const check = (userId) => {
	const table = getCurrentTable(userId);
	if (!table) {
		return { success: false, error: 'Table not found' };
	}

	const player = table.players.get(userId);

	// TODO

	return { success: true, table };
};

const call = (userId) => {
	const table = getCurrentTable(userId);
	if (!table) {
		return { success: false, error: 'Table not found' };
	}

	const player = table.players.get(userId);

	// TODO

	return { success: true, table };
};

const raise = (userId, amount) => {
	const table = getCurrentTable(userId);
	if (!table) {
		return { success: false, error: 'Table not found' };
	}

	const player = table.players.get(userId);

	// TODO

	return { success: true, table };
};

const allIn = (userId, amount) => {
	const table = getCurrentTable(userId);
	if (!table) {
		return { success: false, error: 'Table not found' };
	}

	const player = table.players.get(userId);

	// TODO

	return { success: true, table };
};

const startHand = (userId) => {
	const table = getCurrentTable(userId);
	if (!table) {
		return { success: false, error: 'Table not found' };
	}

	if (table.handActive) {
		return { error: 'Hand already in progress' };
	}

	if (userId !== table.seats[table.dealerIndex]) {
		return { error: 'Only dealer can start' };
	}

	table.handActive = true;

	table.players.forEach((player) => {
		player.inHand = player.hasBoughtIn;
	});

	const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
	const ranks = [
		'2',
		'3',
		'4',
		'5',
		'6',
		'7',
		'8',
		'9',
		'10',
		'J',
		'Q',
		'K',
		'A'
	];
	let deck = [];

	for (const suit of suits) {
		for (const rank of ranks) {
			deck.push({ suit, rank });
		}
	}

	for (let i = deck.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[deck[i], deck[j]] = [deck[j], deck[i]];
	}

	table.deck = deck;

	const inHandPlayers = Array.from(table.players.values()).filter(
		(p) => p.inHand
	);

	inHandPlayers.forEach((player) => {
		player.holeCards = [table.deck.pop()];
	});

	inHandPlayers.forEach((player) => {
		player.holeCards.push(table.deck.pop());
	});

	return { success: true, table };
};

module.exports = {
	hostTable,
	joinTable,
	leaveTable,
	handleSocketDisconnect,
	getCurrentTable,
	addSocketToPlayer,
	buyIn,
	fold,
	check,
	call,
	raise,
	allIn,
	startHand
};
