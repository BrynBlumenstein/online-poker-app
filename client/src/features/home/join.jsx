import { useState } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import HomeTile from './home-tile';
import HomeDialog from './home-dialog';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import useSnackbar from '../../contexts/snackbar/use-snackbar';
import useTable from '../../contexts/table/use-table';

const Join = () => {
	const { showSnackbar } = useSnackbar();
	const [open, setOpen] = useState(false);
	const [joinCode, setJoinCode] = useState('');
	const { joinTable } = useTable();

	const handleJoinClick = (event) => {
		event.currentTarget.blur();
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setJoinCode('');
	};

	const isValidJoinCode = (code) => {
		return /^[A-Z0-9]{6}$/i.test(code);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!isValidJoinCode(joinCode)) {
			showSnackbar('Invalid join code', 'error');
			return;
		}

		try {
			await joinTable(joinCode);
			showSnackbar('Table joined successfully');
		} catch (err) {
			showSnackbar(err.message, 'error');
		}
	};

	const handleJoinCodeChange = (value) => {
		setJoinCode(value);
	};

	return (
		<>
			<HomeTile
				level="top"
				icon={<TravelExploreIcon fontSize="large" />}
				label="Join a Table"
				onTileClick={handleJoinClick}
			/>
			<HomeDialog
				open={open}
				handleClose={handleClose}
				handleSubmit={handleSubmit}
				title="Join a Table"
			>
				<Stack spacing={3}>
					<TextField
						label="Join Code"
						placeholder='XXXXXX'
						value={joinCode}
						onChange={({ target }) => {
							handleJoinCodeChange(target.value);
						}}
						slotProps={{
							inputLabel: {
								shrink: true
							}
						}}
					></TextField>
				</Stack>
				<DialogActions>
					<Button type="submit">Join</Button>
					<Button onClick={handleClose}>Close</Button>
				</DialogActions>
			</HomeDialog>
		</>
	);
};

export default Join;
