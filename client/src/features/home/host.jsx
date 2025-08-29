import HomeTile from './home-tile';
import TableBarIcon from '@mui/icons-material/TableBar';
import tablesService from '../../services/tables-service';
import useSnackbar from '../../contexts/snackbar/use-snackbar';
import { useNavigate } from 'react-router-dom';

const Host = () => {
	const { showSnackbar } = useSnackbar();
	const navigate = useNavigate();

	const handleHostClick = async () => {
		try {
			const token = localStorage.getItem('token');
			const hostedTable = await tablesService.hostTable(token);
			showSnackbar('Table hosted successfully');
			navigate(`/tables/${hostedTable.id}`);
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
