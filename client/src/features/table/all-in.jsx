import useAuth from '../../contexts/auth/use-auth';
import useTable from '../../contexts/table/use-table';
import ActionButton from './action-button';

const AllIn = ({ disabled }) => {
	const { user } = useAuth();
	const { table, allIn } = useTable();

	const handleClick = () => {
		allIn(table.players.get(user.id).stack);
	};

	return (
		<ActionButton
			handleClick={handleClick}
			disabled={disabled}
			label="All In"
		/>
	);
};

export default AllIn;
