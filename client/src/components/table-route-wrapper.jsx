import { useParams, Navigate } from 'react-router-dom';
import useTable from '../contexts/table/use-table';

const TableRouteWrapper = ({ children }) => {
	const { table } = useTable();
	const { tableId } = useParams();

    if (!table) {
        return <Navigate to="/" replace />;
    }
	if (table.id !== tableId) {
		return <Navigate to={`/tables/${table.id}`} replace />;
	}

	return children;
};

export default TableRouteWrapper;
