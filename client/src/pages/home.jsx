import Stack from '@mui/material/Stack';
import TileRow from '../components/tile-row';
import Host from '../features/home/host';
import Join from '../features/home/join';
import Funds from '../features/home/funds';
import Account from '../features/home/account';
import Friends from '../features/home/friends';

const Home = () => {
	return (
		<Stack spacing={4} sx={{ margin: 8 }}>
			<TileRow>
				<Host />
				<Join />
				<Funds />
			</TileRow>
			<TileRow>
				<Account />
				<Friends />
			</TileRow>
		</Stack>
	);
};

export default Home;
