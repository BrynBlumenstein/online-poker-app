import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
	Outlet
} from 'react-router-dom';
import SignIn from './pages/sign-in';
import SignUp from './pages/sign-up';
import Home from './pages/home';
import Table from './pages/table';
import PublicRoute from './components/public-route';
import ProtectedRoute from './components/protected-route';
import HeaderLayout from './components/header-layout';
import useTable from './contexts/table/use-table';
import TableRouteWrapper from './components/table-route-wrapper';
import useAuth from './contexts/auth/use-auth';

const App = () => {
	const { fetchingUser } = useAuth();
	const { table, fetchingTable } = useTable();

	if (fetchingUser || fetchingTable) return null;

	return (
		<Router>
			<Routes>
				<Route element={table ? <Outlet /> : <HeaderLayout />}>
					<Route
						path="/sign-in"
						element={
							<PublicRoute>
								<SignIn />
							</PublicRoute>
						}
					/>
					<Route
						path="/sign-up"
						element={
							<PublicRoute>
								<SignUp />
							</PublicRoute>
						}
					/>
					<Route
						path="/"
						element={
							table ? (
								<Navigate to={`/tables/${table.id}`} replace />
							) : (
								<ProtectedRoute>
									<Home />
								</ProtectedRoute>
							)
						}
					/>
					<Route
						path="/tables/:tableId"
						element={
							<ProtectedRoute>
								<TableRouteWrapper>
									<Table />
								</TableRouteWrapper>
							</ProtectedRoute>
						}
					/>
				</Route>
			</Routes>
		</Router>
	);
};

export default App;
