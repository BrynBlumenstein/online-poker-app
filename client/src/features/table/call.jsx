import useTable from '../../contexts/table/use-table';
import ActionButton from './action-button';

const Call = ({ disabled }) => {
	const { call } = useTable();

	const handleClick = () => {
		call();
	};

	return (
		<ActionButton
			handleClick={handleClick}
			disabled={disabled}
			label="Call"
		/>
	);
};

export default Call;
