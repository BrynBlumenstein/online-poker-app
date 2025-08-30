import HomeTile from './home-tile';
import TableBarIcon from '@mui/icons-material/TableBar';
import useSnackbar from '../../contexts/snackbar/use-snackbar';
import useTable from '../../contexts/table/use-table';

const Host = () => {
	const { showSnackbar } = useSnackbar();
	const { hostTable } = useTable();

	const handleHostClick = async () => {
		try {
			await hostTable();
			showSnackbar('Table hosted successfully');
		} catch (err) {
			showSnackbar(err.message, 'error');
		}
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
