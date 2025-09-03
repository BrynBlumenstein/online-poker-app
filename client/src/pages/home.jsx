import Stack from '@mui/material/Stack';
import TileRow from '../features/home/tile-row';
import Host from '../features/home/host';
import Join from '../features/home/join';
// import Funds from '../features/home/funds';
import Account from '../features/home/account';
import Users from '../features/home/users';

const Home = () => {
	return (
		<Stack spacing={4} sx={{ margin: 8 }}>
			<TileRow>
				<Host />
				<Join />
				{/* <Funds /> */}
			</TileRow>
			<TileRow>
				<Account />
				<Users />
			</TileRow>
		</Stack>
	);
};

export default Home;
