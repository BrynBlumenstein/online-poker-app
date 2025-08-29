import { useState, useEffect } from 'react';
import HomeTile from './home-tile';
import GroupIcon from '@mui/icons-material/Group';
import useSnackbar from '../../contexts/snackbar/use-snackbar';
import HomeDialog from './home-dialog';
import Stack from '@mui/material/Stack';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import usersService from '../../services/users-service';
import MoneyList from './money-list';
import Following from './following';
import FindUser from './find-user';

const Users = () => {
	const { showSnackbar } = useSnackbar();
	const [open, setOpen] = useState(false);
	const [tab, setTab] = useState(0);
	const [allUsers, setAllUsers] = useState(null);
	const [following, setFollowing] = useState(null);

	useEffect(() => {
		const fetchAllUsers = async () => {
			try {
				const users = await usersService.getAllUsers();
				setAllUsers(users);
			} catch (err) {
				showSnackbar(err.message, 'error');
			}
		};

		const fetchFollowing = async () => {
			const token = localStorage.getItem('token');
			try {
				const fetchedFollowing = await usersService.getFollowing(token);
				setFollowing(fetchedFollowing);
			} catch (err) {
				showSnackbar(err.message, 'error');
			}
		};

		fetchAllUsers();
		fetchFollowing();
	}, [showSnackbar]);

	const handleUsersClick = (event) => {
		event.currentTarget.blur();
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleTabChange = (event, newTab) => {
		setTab(newTab);
	};

	const handleUnfollow = async (followingId) => {
		try {
			const token = localStorage.getItem('token');
			const response = await usersService.unfollowUser(
				followingId,
				token
			);

			setFollowing((prev) =>
				prev.filter((user) => user.id !== followingId)
			);
			showSnackbar(response.message);
		} catch (err) {
			showSnackbar(err.message, 'error');
		}
	};

	const handleFollow = async (followingId) => {
		try {
			const token = localStorage.getItem('token');
			const followedUser = await usersService.followUser(
				followingId,
				token
			);

			setFollowing((prev) => [...prev, followedUser]);
			showSnackbar('Follow successful');
		} catch (err) {
			showSnackbar(err.message, 'error');
		}
	};

	return (
		<>
			<HomeTile
				icon={<GroupIcon fontSize="large" />}
				label="Users"
				onTileClick={handleUsersClick}
			/>
			<HomeDialog
				open={open}
				handleClose={handleClose}
				handleSubmit={(event) => event.preventDefault()}
				title="Users"
			>
				<Stack spacing={3}>
					<Tabs
						variant="fullWidth"
						value={tab}
						onChange={handleTabChange}
					>
						<Tab label="Money List" icon={<LeaderboardIcon />} />
						<Tab label="Following" icon={<BookmarkIcon />} />
						<Tab label="Find User" icon={<PersonSearchIcon />} />
					</Tabs>

					<Box sx={{ height: '13rem' }}>
						{tab === 0 && allUsers && (
							<MoneyList
								listedUsers={[...allUsers].sort(
									(a, b) => b.winnings - a.winnings
								)}
							/>
						)}
						{tab === 1 && (
							<Following
								listedUsers={following}
								onUnfollow={handleUnfollow}
							/>
						)}
						{tab === 2 && (
							<FindUser
								allUsers={allUsers}
								following={following}
								onFollow={handleFollow}
								onUnfollow={handleUnfollow}
							/>
						)}
					</Box>
				</Stack>
				<DialogActions>
					<Button onClick={handleClose}>Close</Button>
				</DialogActions>
			</HomeDialog>
		</>
	);
};

export default Users;
