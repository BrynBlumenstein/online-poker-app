import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/sign-in';
import SignUp from './pages/sign-up';
import Home from './pages/home';
import PublicRoute from './components/public-route';
import ProtectedRoute from './components/protected-route';

const App = () => {
	return (
		<Router>
			<Routes>
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
			</Routes>
		</Router>
	);
};

export default App;
