import { useState, useEffect } from 'react';
import TableContext from './table-context';
import tablesService from '../../services/tables-service';
import tokenService from '../../services/token-service';

const TableProvider = ({ children }) => {
	const [table, setTable] = useState(null);
	const [fetchingTable, setFetchingTable] = useState(true);

	useEffect(() => {
		const fetchTable = async () => {
			const token = tokenService.get();
			if (token) {
				try {
					const tableData = await tablesService.getCurrentTable(
						token
					);
					if (tableData) {
						setTable(tableData);
					}
				} catch (err) {
					console.error(err);
				}
			}
			setFetchingTable(false);
		};

		fetchTable();
	}, []);

	const hostTable = async () => {
		const token = tokenService.get();
		const hostedTable = await tablesService.hostTable(token);
		setTable(hostedTable);
	};

	const joinTable = async (joinCode) => {
		const token = tokenService.get();
		const joinedTable = await tablesService.joinTable(joinCode, token);
		setTable(joinedTable);
	};

	const leaveTable = async () => {
		const token = tokenService.get();
		await tablesService.leaveTable(table.id, token);
		setTable(null);
	};

	const updateTable = (updates, replace = false) => {
		if (replace) {
			setTable(updates);
		} else {
			setTable((prev) => ({ ...prev, ...updates }));
		}
	};

	return (
		<TableContext.Provider
			value={{ table, fetchingTable, hostTable, joinTable, leaveTable, updateTable }}
		>
			{children}
		</TableContext.Provider>
	);
};

export default TableProvider;
