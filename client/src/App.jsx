import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignInPage from './pages/sign-in-page';
import SignUpPage from './pages/sign-up-page';

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/sign-in" element={<SignInPage />} />
				<Route path="/sign-up" element={<SignUpPage />} />
			</Routes>
		</Router>
	);
}

export default App;
