import { useState } from 'react';
import useAuth from '../../contexts/auth/use-auth';
import useTable from '../../contexts/table/use-table';
import useSnackbar from '../../contexts/snackbar/use-snackbar';
import InputAdornment from '@mui/material/InputAdornment';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TableDialog from './table-dialog';
import ActionButton from './action-button';

const Raise = ({ disabled }) => {
	const { user } = useAuth();
	const { table, raise } = useTable();
	const { showSnackbar } = useSnackbar();
	const [open, setOpen] = useState(false);
	const [amount, setAmount] = useState('');

	const handleRaiseClick = (event) => {
		event.currentTarget.blur();
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setAmount('');
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		if (amount === '') {
			showSnackbar('Enter an amount', 'error');
			return;
		}

		if (amount < table.minRaise) {
			showSnackbar('Match or exceed minimum raise amount', 'error');
			return;
		}

		if (amount > table.players[user.id].stack) {
			showSnackbar('You cannot raise more than you have', 'error');
			return;
		}

		if (amount === table.players[user.id].stack) {
			showSnackbar('Go all in', 'error');
			return;
		}

		raise(amount);
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
		<>
			<TableDialog
				open={open}
				handleClose={handleClose}
				handleSubmit={handleSubmit}
				title="Raise"
			>
				<Stack spacing={3}>
					<TextField
						label="Amount"
						variant="standard"
						type="text"
						required
						value={amount}
						onChange={handleAmountChange}
						helperText={`Enter a whole dollar amount (minimum raise is $${table.minRaise})`}
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
					<Button type="submit">Raise</Button>
					<Button onClick={handleClose}>Cancel</Button>
				</DialogActions>
			</TableDialog>
			<ActionButton
				handleClick={handleRaiseClick}
				disabled={disabled}
				label="Raise"
			/>
		</>
	);
};

export default Raise;
