import useTable from '../../contexts/table/use-table';
import ActionButton from './action-button';

const StartHand = ({ disabled }) => {
	const { startHand } = useTable();

	const handleClick = () => {
		startHand();
	};

	return (
		<ActionButton
			handleClick={handleClick}
			disabled={disabled}
			label="Start Hand"
		/>
	);
};

export default StartHand;
