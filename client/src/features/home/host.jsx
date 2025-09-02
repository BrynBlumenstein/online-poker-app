import HomeTile from './home-tile';
import TableBarIcon from '@mui/icons-material/TableBar';
import useTable from '../../contexts/table/use-table';

const Host = () => {
	const { hostTable } = useTable();

	const handleHostClick = () => {
		hostTable();
	};

	return (
		<HomeTile
			level="top"
			icon={<TableBarIcon fontSize="large" />}
			label="Host a Table"
			onTileClick={handleHostClick}
		/>
	);
};

export default Host;
