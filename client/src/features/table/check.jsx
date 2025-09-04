import useTable from '../../contexts/table/use-table';
import ActionButton from './action-button';

const Check = ({ disabled }) => {
	const { check } = useTable();

	const handleClick = () => {
		check();
	};

	return (
		<ActionButton
			handleClick={handleClick}
			disabled={disabled}
			label="Check"
		/>
	);
};

export default Check;
