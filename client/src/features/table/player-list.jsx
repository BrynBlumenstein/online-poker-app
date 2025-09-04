import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import useTable from '../../contexts/table/use-table';

const PlayerList = () => {
	const { table } = useTable();

	return (
		<Paper>
			<List>
				<Divider variant="middle" />
				{Array.from(table.players.values()).map((player) => (
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
				))}
			</List>
		</Paper>
	);
};

export default PlayerList;
