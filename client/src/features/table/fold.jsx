import useTable from '../../contexts/table/use-table';
import ActionButton from './action-button';

const Fold = ({ disabled }) => {
	const { fold } = useTable();

	const handleClick = () => {
		fold();
	};

	return (
		<ActionButton
			handleClick={handleClick}
			disabled={disabled}
			label="Fold"
		/>
	);
};

export default Fold;
