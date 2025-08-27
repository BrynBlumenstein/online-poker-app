import { useState } from 'react';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import HomeTile from './home-tile';
import useAuth from '../../contexts/auth/use-auth';
import useSnackbar from '../../contexts/snackbar/use-snackbar';
import usersService from '../../services/users-service';

const Funds = () => {
	const { user, updateUser } = useAuth();
	const { showSnackbar } = useSnackbar();
	const [open, setOpen] = useState(false);
	const [selection, setSelection] = useState('deposit');
	const [amount, setAmount] = useState('');
	const [balanceAfter, setBalanceAfter] = useState(user.balance);

	const handleFundsClick = (event) => {
		event.currentTarget.blur();
		setOpen(true);
	};

	const handleClose = (balance = user.balance) => {
		setOpen(false);
		setAmount('');
		setBalanceAfter(balance);
		setSelection('deposit');
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (balanceAfter === user.balance) {
			showSnackbar('Enter an amount', 'error');
			return;
		}

		const token = localStorage.getItem('token');
		try {
			const updatedUser = await usersService.updateBalance(
				balanceAfter,
				token
			);

			updateUser({ balance: updatedUser.balance });

			showSnackbar(`Balance updated to $${updatedUser.balance}`);
			handleClose(updatedUser.balance);
		} catch (err) {
			showSnackbar(err.message, 'error');
			return false;
		}
	};

	const handleSelectionChange = (value) => {
		setSelection(value);
		setAmount('');
		setBalanceAfter(user.balance);
	};

	const handleAmountChange = (event) => {
		let value = event.target.value;
		value = value.replace(/[^0-9]/g, '');

		if (value === '' || value === '0') {
			setAmount('');
			setBalanceAfter(user.balance);
			return;
		}

		let num = Number(value);

		num =
			selection === 'deposit'
				? Math.min(Math.max(num, 1), 100)
				: Math.min(Math.max(num, 1), user.balance);

		const displayAmount =
			selection === 'deposit' ? num : Math.min(num, user.balance);

		const newBalance =
			selection === 'deposit'
				? user.balance + num
				: Math.max(user.balance - num, 0);

		setAmount(displayAmount !== 0 ? displayAmount : '');
		setBalanceAfter(newBalance);
	};

	let helperText;

	if (selection === 'deposit') {
		helperText = 'Enter a whole dollar amount from $1 to $100';
	} else {
		if (user.balance === 0) {
			helperText = 'You have no money to withdraw';
		} else if (user.balance === 1) {
			helperText = 'You only have $1 available to withdraw';
		} else {
			helperText = `Enter a whole dollar amount from $1 to $${user.balance}`;
		}
	}

	return (
		<>
			<HomeTile
				level="top"
				icon={<AccountBalanceWalletIcon fontSize="large" />}
				label="Manage Funds"
				onTileClick={handleFundsClick}
			/>
			<Dialog
				open={open}
				fullWidth
				maxWidth="xs"
				onClose={() => handleClose()}
				slotProps={{
					paper: {
						component: 'form',
						onSubmit: (event) => handleSubmit(event),
						noValidate: true,
						autoComplete: 'off'
					}
				}}
			>
				<DialogTitle>Manage Funds</DialogTitle>
				<DialogContent dividers>
					<Stack spacing={2}>
						<ToggleButtonGroup
							color="primary"
							value={selection}
							exclusive
							onChange={(event, value) =>
								handleSelectionChange(value)
							}
						>
							<ToggleButton value="deposit">Deposit</ToggleButton>
							<ToggleButton value="withdraw">
								Withdraw
							</ToggleButton>
						</ToggleButtonGroup>
						<TextField
							label="Amount"
							variant="standard"
							type="text"
							required
							value={amount}
							onChange={handleAmountChange}
							helperText={helperText}
							slotProps={{
								input: {
									startAdornment: (
										<InputAdornment position="start">
											$
										</InputAdornment>
									),
									inputProps: {
										min: 1,
										max:
											selection === 'deposit'
												? 100
												: user.balance,
										step: 1
									}
								}
							}}
						/>
						<DialogContentText>
							Balance after transaction: ${balanceAfter}
						</DialogContentText>
					</Stack>
					<DialogActions>
						<Button type="submit">Confirm</Button>
						<Button onClick={() => handleClose()}>Cancel</Button>
					</DialogActions>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default Funds;
