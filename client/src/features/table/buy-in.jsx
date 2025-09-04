import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TableDialog from './table-dialog';
import useTable from '../../contexts/table/use-table';
import useAuth from '../../contexts/auth/use-auth';
import useSnackbar from '../../contexts/snackbar/use-snackbar';

const MIN_BUY_IN = 20;
const MAX_BUY_IN = 50;

const BuyIn = () => {
	const { table, buyIn } = useTable();
	const { user } = useAuth();
	const { showSnackbar } = useSnackbar();
	const [open, setOpen] = useState(false);
	const [amount, setAmount] = useState('');

	useEffect(() => {
		if (!table.players.get(user.id).hasBoughtIn) {
			setOpen(true);
		}
	}, [table.players, user.id]);

	const handleSubmit = (event) => {
		event.preventDefault();

		if (table.players.get(user.id).hasBoughtIn) {
			showSnackbar('Already bought in', 'error');
			return;
		}

		if (amount === '') {
			showSnackbar('Enter an amount', 'error');
			return;
		}

		if (amount < MIN_BUY_IN || amount > MAX_BUY_IN) {
			showSnackbar('Amount not in buy-in range', 'error');
			return;
		}

		buyIn(amount);
		setOpen(false);
		setAmount('');
	};

	const handleAmountChange = (event) => {
		let value = event.target.value;
		value = value.replace(/[^0-9]/g, '');

		if (value === '' || value === '0') {
			setAmount('');
			return;
		}

		let num = Number(value);

		num = Math.max(num, 1);

		setAmount(num !== 0 ? num : '');
	};

	return (
		<TableDialog
			open={open}
			handleClose={() => {}}
			handleSubmit={handleSubmit}
			title={'Buy-In'}
		>
			<Stack spacing={3}>
				<TextField
					label="Amount"
					variant="standard"
					type="text"
					required
					value={amount}
					onChange={handleAmountChange}
					helperText={`Enter a whole dollar amount from $${MIN_BUY_IN} to $${MAX_BUY_IN}`}
					slotProps={{
						input: {
							startAdornment: (
								<InputAdornment position="start">
									$
								</InputAdornment>
							)
						}
					}}
				/>
			</Stack>
			<DialogActions>
				<Button type="submit">Buy-In</Button>
			</DialogActions>
		</TableDialog>
	);
};

export default BuyIn;
