import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { useState } from 'react';
import { isValidUsername } from '../../utils/auth-utils';
import useAuth from '../../contexts/auth/use-auth';

const FindUser = ({ allUsers, following, onFollow, onUnfollow }) => {
	const { user } = useAuth();
	const [username, setUsername] = useState('');
	const [listedUser, setListedUser] = useState(null);

	const handleUsernameChange = (value) => {
		setUsername(value);

		if (!isValidUsername(value)) {
			setListedUser(null);
		} else {
			const searchedUser = allUsers.find(
				(u) => u.username === value && value !== user.username
			);
			setListedUser(searchedUser || null);
		}
	};

	const notFollowing = listedUser && !following.some(
		(user) => user.id === listedUser.id
	);

	return (
		<Stack spacing={3}>
			<TextField
				label="Username"
				size="small"
				value={username}
				onChange={({ target }) => {
					handleUsernameChange(target.value);
				}}
				slotProps={{
					inputLabel: {
						shrink: true
					}
				}}
			></TextField>
			<TableContainer
				sx={{
					borderRadius: '3px'
				}}
			>
				<Table size="small">
					<TableBody>
						{listedUser ? (
							<TableRow>
								<TableCell>{listedUser.username}</TableCell>
								<TableCell>
									Winnings: ${listedUser.winnings}
								</TableCell>
								<TableCell>
									Hands Won: {listedUser.hands_won}
								</TableCell>
								<TableCell>
									{notFollowing ? (
										<IconButton
											onClick={() =>
												onFollow(listedUser.id)
											}
										>
											<BookmarkAddIcon />
										</IconButton>
									) : (
										<IconButton
											onClick={() =>
												onUnfollow(listedUser.id)
											}
										>
											<BookmarkRemoveIcon />
										</IconButton>
									)}
								</TableCell>
							</TableRow>
						) : (
							<TableRow>
								<TableCell align="center" colSpan={4}>
									No user found
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};

export default FindUser;
