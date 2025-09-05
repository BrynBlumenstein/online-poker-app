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
		const dealerIndex = table.dealerIndex;
		if (
			table.handActive ||
			dealerIndex === -1 ||
			table.seats[dealerIndex] !== user.id
		) {
			setActionsDisabled(true);
		} else {
			setActionsDisabled(false);
		}
	}, [table.dealerIndex, table.handActive, table.seats, user.id]);

	return (
		<Stack direction="row" justifyContent="center" spacing={3}>
			<StartHand disabled={actionsDisabled} />
		</Stack>
	);
};

export default DealerActions;
