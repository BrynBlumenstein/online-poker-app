import { useState } from 'react';
import HomeTile from './home-tile';
import PersonIcon from '@mui/icons-material/Person';
import useAuth from '../../contexts/auth/use-auth';
import useSnackbar from '../../contexts/snackbar/use-snackbar';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import EditOffIcon from '@mui/icons-material/EditOff';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import Stack from '@mui/material/Stack';
import HomeDialog from './home-dialog';

const Account = () => {
	const { user, updateUsername } = useAuth();
	const { showSnackbar } = useSnackbar();
	const [open, setOpen] = useState(false);
	const [editing, setEditing] = useState(false);
	const [newUsername, setNewUsername] = useState(user.username);

	const handleAccountClick = (event) => {
		event.currentTarget.blur();
		setOpen(true);
	};

	const handleClose = (username = user.username) => {
		setOpen(false);
		setEditing(false);
		setNewUsername(username);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (newUsername === user.username) {
			showSnackbar('Enter a new username', 'error');
			return;
		}

		try {
			const updatedUser = await updateUsername(newUsername);
			showSnackbar(`Username changed to ${updatedUser.username}`);
			handleClose(updatedUser.username);
		} catch (err) {
			showSnackbar(err.message, 'error');
		}
	};

	const handleUsernameChange = (event) => {
		setNewUsername(event.target.value);
	};

	const handleClickEditing = () => {
		setEditing((prev) => !prev);
		setNewUsername(user.username);
	};

	const handleMouseDownEditing = (event) => {
		event.preventDefault();
	};

	const handleMouseUpEditing = (event) => {
		event.preventDefault();
	};

	return (
		<>
			<HomeTile
				icon={<PersonIcon fontSize="large" />}
				label="Account"
				onTileClick={handleAccountClick}
			/>
			<HomeDialog
				open={open}
				handleClose={() => handleClose()}
				handleSubmit={handleSubmit}
				title="Account"
			>
				<Stack spacing={3}>
					<Stack spacing={1}>
						<DialogContentText>
							Lifetime Winnings: ${user.winnings}
						</DialogContentText>
						<DialogContentText>
							Hands Won: {user.hands_won}
						</DialogContentText>
					</Stack>
					<TextField
						fullWidth
						label="Username"
						variant="standard"
						type="text"
						value={newUsername}
						onChange={handleUsernameChange}
						helperText={
							editing
								? 'Username must be 3-15 characters long and can only contain letters, numbers, or underscores.'
								: ' '
						}
						disabled={!editing}
						slotProps={{
							formHelperText: { sx: { minHeight: '3rem' } },
							input: {
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											onClick={handleClickEditing}
											onMouseDown={handleMouseDownEditing}
											onMouseUp={handleMouseUpEditing}
											edge="end"
										>
											{editing ? (
												<EditOffIcon />
											) : (
												<EditIcon />
											)}
										</IconButton>
									</InputAdornment>
								)
							},
							inputLabel: {
								shrink: true
							}
						}}
					/>
				</Stack>
				<DialogActions>
					<Button
						type="submit"
						sx={{ visibility: editing ? 'visible' : 'hidden' }}
					>
						Save
					</Button>
					<Button onClick={() => handleClose()}>Close</Button>
				</DialogActions>
			</HomeDialog>
		</>
	);
};

export default Account;
