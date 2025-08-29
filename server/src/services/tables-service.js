const MAX_PLAYERS = 9;

const activePlayers = new Map();
const tables = new Map();

const generateTableId = () => {
	let id;
	do {
		id = Math.random().toString(36).slice(2, 8).toUpperCase();
	} while (getTable(id));
	return id;
};

const createTable = (hostId) => {
	if (activePlayers.has(hostId)) {
        throw new Error('You are already at a table');
    }

	const id = generateTableId();
	const newTable = {
        id: id,
		players: [hostId]
	};

	tables.set(id, newTable);
	activePlayers.set(hostId, newTable.id);

	return newTable;
};

const joinTable = (playerId, table) => {
	if (!table) {
		throw new Error('Table not found');
	}
    if (activePlayers.has(playerId)) {
        throw new Error('You are already at a table');
    }
	if (table.players.length >= MAX_PLAYERS) {
		throw new Error('Table is full');
	}

	table.players.push(playerId);
    activePlayers.set(playerId, table.id);

	return table;
};

const deleteTable = (tableId) => {
	return tables.delete(tableId);
};

const leaveTable = (playerId, table) => {
	if (!table) {
		throw new Error('Table not found');
	}
    
    const index = table.players.indexOf(playerId);
    if (index === -1) {
        throw new Error('You are not at this table');
    }

    table.players.splice(index, 1);
    activePlayers.delete(playerId);

    if (table.players.length === 0) {
        deleteTable(table.id);
        return null;
    }

	return table;
};

const getTable = (tableId) => {
	const table = tables.get(tableId);

	if (!table) {
		return null;
	}

	return table;
};

const getTables = () => {
	return Array.from(tables.values());
}

module.exports = { createTable, joinTable, leaveTable, getTable, getTables };
