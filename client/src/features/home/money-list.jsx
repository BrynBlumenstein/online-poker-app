import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TablePagination from '@mui/material/TablePagination';

const MoneyList = ({ listedUsers }) => {
	const toOrdinal = (n) => {
		const suffixes = ['th', 'st', 'nd', 'rd'];
		const lastTwoDigits = n % 100;
		return (
			n +
			(suffixes[(lastTwoDigits - 20) % 10] ||
				suffixes[lastTwoDigits] ||
				suffixes[0])
		);
	};

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
							<TableCell></TableCell>
							<TableCell>User</TableCell>
							<TableCell>Winnings</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{listedUsers &&
							listedUsers
								.slice(0, 25)
								.map((listedUser, index) => {
									return (
										<TableRow hover key={index + 1}>
											<TableCell>
												{toOrdinal(index + 1)}
											</TableCell>
											<TableCell>
												{listedUser.username}
											</TableCell>
											<TableCell>
												${listedUser.winnings}
											</TableCell>
										</TableRow>
									);
								})}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);
};

export default MoneyList;
