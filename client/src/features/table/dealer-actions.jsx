import { useState, useEffect } from 'react';
import useAuth from '../../contexts/auth/use-auth';
import useTable from '../../contexts/table/use-table';
import Stack from '@mui/material/Stack';
import StartHand from './start-hand';

const DealerActions = () => {
	const { user } = useAuth();
	const { table } = useTable();
	const [actionsDisabled, setActionsDisabled] = useState(true);

	useEffect(() => {
		if (table.dealerId !== user.id) {
			setActionsDisabled(false);
		}
	}, [table.dealerId, user.id]);

	return (
		<Stack direction="row" justifyContent="center" spacing={3}>
			<StartHand disabled={actionsDisabled} />
		</Stack>
	);
};

export default DealerActions;
