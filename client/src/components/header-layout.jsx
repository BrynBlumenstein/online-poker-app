import { Outlet } from 'react-router-dom';
import Header from './header';

const HeaderLayout = () => {
	return (
		<>
			<Header />
			<Outlet />
		</>
	);
};

export default HeaderLayout;
