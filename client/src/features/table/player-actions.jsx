import { useState, useEffect } from 'react';
import useAuth from '../../contexts/auth/use-auth';
import useTable from '../../contexts/table/use-table';
import Stack from '@mui/material/Stack';
import Fold from './fold';
import Check from './check';
import Call from './call';
import Raise from './raise';
import AllIn from './all-in';

const PlayerActions = () => {
	const { user } = useAuth();
	const { table } = useTable();
	const [actionsDisabled, setActionsDisabled] = useState(true);

	useEffect(() => {
		const actionOnIndex = table.actionOnIndex;
		if (
			actionOnIndex === -1 ||
			!table.players.get(user.id).inHand ||
			table.seats[actionOnIndex] !== user.id
		) {
			setActionsDisabled(true);
		} else {
			setActionsDisabled(false);
		}
	}, [table.actionOnIndex, table.players, table.seats, user.id]);

	return (
		<Stack direction="row" justifyContent="center" spacing={3}>
			<Fold disabled={actionsDisabled} />
			<Check disabled={actionsDisabled} />
			<Call disabled={actionsDisabled} />
			<Raise disabled={actionsDisabled} />
			<AllIn disabled={actionsDisabled} />
		</Stack>
	);
};

export default PlayerActions;
