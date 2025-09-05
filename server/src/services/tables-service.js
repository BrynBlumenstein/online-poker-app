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
		playersBoughtIn: [],
		playersInHand: [],
		handActive: false,
		pot: 0,
		deck: [],
		boardCards: [],
		dealerIndex: -1,
		smallBlindIndex: -1,
		bigBlindIndex: -1,
		actionOnIndex: -1,
		lastToActIndex: -1,
		activeBet: 0,
		lastRaise: 0,
		minRaise: 0,
		street: null
	};

	const player = {
		userId,
		username,
		socketIds: new Set(),
		hasBoughtIn: false,
		stack: 0,
		inHand: false,
		holeCards: [],
		currentBet: 0
	};
	table.players.set(userId, player);
	table.seats[0] = userId;
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
		holeCards: [],
		currentBet: 0
	};
	table.players.set(userId, player);
	table.seats[seatIndex] = userId;
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

	const boughtInIndex = table.playersBoughtIn.indexOf(userId);
	if (boughtInIndex !== -1) {
		table.playersBoughtIn.splice(boughtInIndex, 1);
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

		const boughtInIndex = stillTable.playersBoughtIn.indexOf(userId);
		if (boughtInIndex !== -1) {
			stillTable.playersBoughtIn.splice(boughtInIndex, 1);
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

const findNextBoughtInSeat = (table, startIndex) => {
	let length = table.seats.length;

	for (let offset = 1; offset <= length; offset++) {
		const index = (startIndex + offset) % length;
		const playerId = table.seats[index];
		if (playerId !== null && table.players.get(playerId).hasBoughtIn) {
			return index;
		}
	}

	return -1;
};

const moveMarkers = (table, reason = null, playerIndex = null) => {
	if (table.playersBoughtIn.length === 1) {
		table.dealerIndex = table.seats.findIndex((id) => {
			return id === table.playersBoughtIn[0];
		});
		table.smallBlindIndex = -1;
		table.bigBlindIndex = -1;
		return;
	}

	if (
		reason === 'handEnded' ||
		(reason === 'playerLeft' && playerIndex === table.dealerIndex)
	) {
		table.dealerIndex = findNextBoughtInSeat(table, table.dealerIndex);
	}

	if (table.playersBoughtIn.length === 2) {
		table.smallBlindIndex = table.dealerIndex;
		table.bigBlindIndex = findNextBoughtInSeat(table, table.dealerIndex);
	} else {
		table.smallBlindIndex = findNextBoughtInSeat(table, table.dealerIndex);
		table.bigBlindIndex = findNextBoughtInSeat(
			table,
			table.smallBlindIndex
		);
	}
};

const buyIn = (userId, amount) => {
	const table = getCurrentTable(userId);
	if (!table) {
		return { success: false, error: 'Table not found' };
	}

	const player = table.players.get(userId);

	player.stack = amount;
	player.hasBoughtIn = true;
	table.playersBoughtIn.push(userId);

	if (!table.handActive) {
		moveMarkers(table);
	}

	return { success: true, table };
};

const dealFlop = (table) => {
	for (let i = 0; i < 3; i++) {
		table.boardCards.push(table.deck.pop());
	}
};

const dealTurnOrRiver = (table) => {
	table.boardCards.push(table.deck.pop());
};

const findPrevInHandSeat = (table, startIndex) => {
	let length = table.seats.length;

	for (let offset = 1; offset <= length; offset++) {
		const index = (startIndex - offset + length) % length;
		const playerId = table.seats[index];
		if (playerId !== null && table.players.get(playerId).inHand) {
			return index;
		}
	}

	return -1;
};

const findLastToActIndex = (table) => {
	const dealerId = table.seats[dealerIndex];
	if (dealerId && table.players.get(dealerId).inHand) {
		return table.dealerIndex;
	}

	return findPrevInHandSeat(table, table.actionOnIndex);
};

const advanceStreet = (table) => {
	const smallBlindId = table.seats[smallBlindIndex];
	smallBlindId && table.players.get(smallBlindId).inHand
		? (table.actionOnIndex = smallBlindIndex)
		: (table.actionOnIndex = findNextInHandSeat(
				table,
				table.smallBlindIndex
		  ));

	if (table.street === 'preflop') {
		table.street === 'flop';
		dealFlop(table);
	} else if (table.street === 'flop') {
		table.street === 'turn';
		dealTurnOrRiver(table);
	} else if (table.street === 'turn') {
		table.street === 'river';
		dealTurnOrRiver(table);
	}

	table.lastToActIndex = findLastToActIndex(table);
	table.activeBet = 0;
	table.lastRaise = 0;
};

const advanceTurn = (userId, table) => {
	if (table.seats[table.lastToActIndex] === userId) {
		advanceStreet(table);
		return;
	}

	table.actionOnIndex = findNextInHandSeat(table, table.actionOnIndex);
};

const endHand = (table) => {
	const winner = table.players.get(table.playersInHand[0]); // TODO determine winner for all cases (this is all players folded case)
	winner.stack += table.pot;

	table.playersInHand.forEach((id) => {
		const player = table.players.get(id);
		player.inHand = false;
		player.currentBet = 0;
		player.holeCards = [];
	});

	table.playersInHand = [];
	table.handActive = false;
	table.pot = 0;
	table.deck = [];
	table.boardCards = [];
	moveMarkers(table, 'handEnded');
	table.actionOnIndex = -1;
	table.lastToActIndex = -1;
	table.activeBet = 0;
	table.lastRaise = 0;
	table.minRaise = 0;
	table.street = null;
};

const fold = (userId) => {
	const table = getCurrentTable(userId);
	if (!table) {
		return { success: false, error: 'Table not found' };
	}

	const player = table.players.get(userId);

	player.inHand = false;
	player.currentBet = 0;
	player.holeCards = [];

	const playerInHandIndex = table.playersInHand.indexOf(userId);
	if (playerInHandIndex !== -1) {
		table.playersInHand.splice(playerInHandIndex, 1);
	}

	if (table.playersInHand.length === 1) {
		endHand(table);
		return { success: true, table };
	}

	advanceTurn(userId, table);

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

const findNextInHandSeat = (table, startIndex) => {
	let length = table.seats.length;

	for (let offset = 1; offset <= length; offset++) {
		const index = (startIndex + offset) % length;
		const playerId = table.seats[index];
		if (playerId !== null && table.players.get(playerId).inHand) {
			return index;
		}
	}

	return -1;
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

	if (table.playersBoughtIn.length < 2) {
		return { error: 'Need at least two players bought in to start' };
	}

	table.handActive = true;

	table.playersBoughtIn.forEach((playerId) => {
		table.players.get(playerId).inHand = true;
		table.playersInHand.push(playerId);
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

	for (let i = 0; i < 2; i++) {
		table.playersInHand.forEach((playerId) => {
			table.players.get(playerId).holeCards.push(table.deck.pop());
		});
	}

	table.street = 'preflop';

	const smallBlind = table.players.get(table.seats[table.smallBlindIndex]);
	const smallBlindAmount = table.blindAmounts[0];
	smallBlind.stack -= smallBlindAmount;
	smallBlind.currentBet = smallBlindAmount;

	const bigBlind = table.players.get(table.seats[table.bigBlindIndex]);
	const bigBlindAmount = table.blindAmounts[1];
	bigBlind.stack -= bigBlindAmount;
	bigBlind.currentBet = bigBlindAmount;

	table.pot += table.pot += smallBlindAmount + bigBlindAmount;
	table.activeBet = bigBlindAmount;
	table.lastRaise = bigBlindAmount;
	table.minRaise = table.activeBet + table.lastRaise;

	table.actionOnIndex = findNextInHandSeat(table, table.bigBlindIndex);
	table.lastToActIndex = table.bigBlindIndex;

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
