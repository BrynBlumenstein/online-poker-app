import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import useTable from '../../contexts/table/use-table';

const PlayerList = () => {
	const { table } = useTable();

	let emptySeats = 0;

	return (
		<Paper>
			<List>
				<Divider variant="middle" />
				{table.seats.map((userId, index) => {
					const player = table.players.get(userId);
					userId &&
						console.log(
							player.username,
							table.handActive,
							player.inHand
						);
					return userId ? (
						<React.Fragment key={userId}>
							<ListItem>
								<ListItemText
									primary={player.username}
									secondary={
										player.hasBoughtIn
											? `Stack: $${player.stack}`
											: 'Has not bought in yet'
									}
								/>
								<ListItemText
									primary=""
									secondary={
										player.inHand
											? `Current bet: $${player.currentBet}`
											: ''
									}
								/>
								{index === table.dealerIndex &&
								(player.inHand || !table.handActive) ? (
									<ListItemAvatar>
										<Avatar>D</Avatar>
									</ListItemAvatar>
								) : null}
								{index === table.smallBlindIndex &&
								(player.inHand || !table.handActive) ? (
									<ListItemAvatar>
										<Avatar>SB</Avatar>
									</ListItemAvatar>
								) : null}
								{index === table.bigBlindIndex &&
								(player.inHand || !table.handActive) ? (
									<ListItemAvatar>
										<Avatar>BB</Avatar>
									</ListItemAvatar>
								) : null}
								{index === table.actionOnIndex &&
								(player.inHand || !table.handActive) ? (
									<ListItemAvatar>
										<Avatar>A</Avatar>
									</ListItemAvatar>
								) : null}
							</ListItem>
							<Divider variant="middle" />
						</React.Fragment>
					) : (
						<React.Fragment key={emptySeats++}>
							<ListItem>
								<ListItemText primary="Seat empty" />
							</ListItem>
							<Divider variant="middle" />
						</React.Fragment>
					);
				})}
				{/* {Array.from(table.players.values()).map((player) => (
					<React.Fragment key={player.userId}>
						<ListItem>
							<ListItemText
								primary={player.username}
								secondary={
									player.hasBoughtIn
										? `Stack: $${player.stack}`
										: 'Has not bought in yet'
								}
							/>
						</ListItem>
						<Divider variant="middle" />
					</React.Fragment>
				))} */}
			</List>
		</Paper>
	);
};

export default PlayerList;
