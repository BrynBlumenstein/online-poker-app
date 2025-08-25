import HomeTile from '../../components/home-tile';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const Funds = () => {
	return (
		<HomeTile
			level="top"
			icon={<AccountBalanceWalletIcon fontSize="large" />}
			label="Manage Funds"
			onTileClick={() => console.log('Click')}
		/>
	);
};

export default Funds;
