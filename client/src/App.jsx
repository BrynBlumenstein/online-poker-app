import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/sign-in';
import SignUp from './pages/sign-up';
import Home from './pages/home';
import Table from './pages/table';
import PublicRoute from './components/public-route';
import ProtectedRoute from './components/protected-route';
import HeaderLayout from './components/header-layout';

const App = () => {
	return (
		<Router>
			<Routes>
				<Route element={<HeaderLayout />}>
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
							<ProtectedRoute>
								<Home />
							</ProtectedRoute>
						}
					/>
				</Route>
				<Route
					path="/tables/:tableId"
					element={
						<ProtectedRoute>
							<Table />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</Router>
	);
};

export default App;
