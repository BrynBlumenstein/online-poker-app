import { useState, useEffect } from 'react';
import useAuth from '../../contexts/auth/use-auth';
import useTable from '../../contexts/table/use-table';
import Stack from '@mui/material/Stack';
import Fold from './fold';
import Call from './call';
import Raise from './raise';
import AllIn from './all-in';

const Actions = () => {
	const { user } = useAuth();
	const { table } = useTable();
	const [actionsDisabled, setActionsDisabled] = useState(true);

	useEffect(() => {
		if (table.currentPlayerId !== user.id) {
			setActionsDisabled(false);
		}
	}, [table.currentPlayerId, user.id]);

	return (
		<Stack direction="row" justifyContent="center" spacing={3}>
			<Fold disabled={actionsDisabled} />
			<Call disabled={actionsDisabled} />
			<Raise disabled={actionsDisabled} />
			<AllIn disabled={actionsDisabled} />
		</Stack>
	);
};

export default Actions;
