import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TablePagination from '@mui/material/TablePagination';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import IconButton from '@mui/material/IconButton';

const Following = ({ listedUsers, onUnfollow }) => {
	return (
		<Paper elevation={3}>
			<TableContainer
				sx={{
					borderRadius: '3px',
					maxHeight: '13rem'
				}}
			>
				<Table size="small" stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell>User</TableCell>
							<TableCell>Winnings</TableCell>
							<TableCell>Hands Won</TableCell>
							<TableCell></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{listedUsers && listedUsers.length !== 0 ? (
							listedUsers.map((listedUser, index) => {
								return (
									<TableRow hover key={index + 1}>
										<TableCell>
											{listedUser.username}
										</TableCell>
										<TableCell>
											${listedUser.winnings}
										</TableCell>
										<TableCell>
											{listedUser.hands_won}
										</TableCell>
										<TableCell>
											<IconButton
												onClick={() =>
													onUnfollow(listedUser.id)
												}
											>
												<BookmarkRemoveIcon />
											</IconButton>
										</TableCell>
									</TableRow>
								);
							})
						) : (
							<TableRow>
								<TableCell align="center" colSpan={4}>
									Users you follow will appear here
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);
};

export default Following;
