import { useState, useEffect } from 'react';
import TableContext from './table-context';
import useSocket from '../../contexts/socket/use-socket';
import useSnackbar from '../snackbar/use-snackbar';

const DELAY_FOR_REFRESH = 300;

const TableProvider = ({ children }) => {
	const [table, setTable] = useState(null);
	const [fetchingTable, setFetchingTable] = useState(true);
	const { showSnackbar } = useSnackbar();
	const { socket, connected } = useSocket();

	useEffect(() => {
		if (!socket || !connected) {
			const timeoutId = setTimeout(
				() => setFetchingTable(false),
				DELAY_FOR_REFRESH
			);
			return () => clearTimeout(timeoutId);
		}

		const onCurrentTable = (tableData) => {
			setTable(tableData || null);
			setFetchingTable(false);
		};

		const onTableUpdated = (tableData) => {
			setTable(tableData);
		};

		socket.on('playerJoined', showSnackbar);
		socket.on('playerLeft', showSnackbar);
		socket.on('playerBoughtIn', showSnackbar);
		socket.on('playerFolded', showSnackbar);
		socket.on('playerCalled', showSnackbar);
		socket.on('playerRaised', showSnackbar);
		socket.on('playerWentAllIn', showSnackbar);
		socket.on('currentTable', onCurrentTable);
		socket.on('tableUpdated', onTableUpdated);

		setFetchingTable(true);
		socket.emit('getCurrentTable');

		return () => {
			socket.off('playerJoined', showSnackbar);
			socket.off('playerLeft', showSnackbar);
			socket.on('playerBoughtIn', showSnackbar);
			socket.off('playerFolded', showSnackbar);
			socket.off('playerCalled', showSnackbar);
			socket.off('playerRaised', showSnackbar);
			socket.off('playerWentAllIn', showSnackbar);
			socket.off('currentTable', onCurrentTable);
			socket.off('tableUpdated');
		};
	}, [socket, connected, showSnackbar]);

	const hostTable = () => {
		if (!socket || !connected) {
			showSnackbar('Not connected', 'error');
		}

		socket.emit('hostTable', (res) => {
			if (res?.error) {
				showSnackbar(res.error, 'error');
				return;
			}

			showSnackbar('Table hosted successfully');
		});
	};

	const joinTable = (tableId) => {
		if (!socket || !connected) {
			showSnackbar('Not connected', 'error');
		}

		socket.emit('joinTable', tableId, (res) => {
			if (res?.error) {
				showSnackbar(res.error, 'error');
				return;
			}

			showSnackbar('Table joined successfully');
		});
	};

	const leaveTable = () => {
		if (!table) {
			showSnackbar('Not at a table', 'error');
		}

		if (!socket || !connected) {
			showSnackbar('Not connected', 'error');
		}

		socket.emit('leaveTable', table.id, (res) => {
			if (res?.error) {
				showSnackbar(res.error, 'error');
				return;
			}

			setTable(null);
			showSnackbar('Successfully left table');
		});
	};

	const signOut = () => {
		if (!socket || !connected) {
			showSnackbar('Not connected', 'error');
		}

		socket.emit('signOut');
	};

	const buyIn = (amount) => {
		if (!socket || !connected) {
			showSnackbar('Not connected', 'error');
		}

		socket.emit('buyIn', amount, (res) => {
			if (res?.error) {
				showSnackbar(res.error, 'error');
				return;
			}

			showSnackbar(`Bought in for $${amount}`);
		});
	};

	const fold = () => {
		if (!socket || !connected) {
			showSnackbar('Not connected', 'error');
		}

		socket.emit('fold', (res) => {
			if (res?.error) {
				showSnackbar(res.error, 'error');
				return;
			}

			showSnackbar('Folded');
		});
	};

	const call = () => {
		if (!socket || !connected) {
			showSnackbar('Not connected', 'error');
		}

		socket.emit('call', (res) => {
			if (res?.error) {
				showSnackbar(res.error, 'error');
				return;
			}

			showSnackbar('Called');
		});
	};

	const raise = (amount) => {
		if (!socket || !connected) {
			showSnackbar('Not connected', 'error');
		}

		socket.emit('raise', amount, (res) => {
			if (res?.error) {
				showSnackbar(res.error, 'error');
				return;
			}

			showSnackbar(`Raised to $${amount}`);
		});
	};

	const allIn = (amount) => {
		if (!socket || !connected) {
			showSnackbar('Not connected', 'error');
		}

		socket.emit('allIn', amount, (res) => {
			if (res?.error) {
				showSnackbar(res.error, 'error');
				return;
			}

			showSnackbar(`Went all in for $${amount}`);
		});
	};

	return (
		<TableContext.Provider
			value={{
				table,
				fetchingTable,
				hostTable,
				joinTable,
				leaveTable,
				signOut,
				buyIn,
				fold,
				call,
				raise,
				allIn
			}}
		>
			{children}
		</TableContext.Provider>
	);
};

export default TableProvider;
