import HomeTile from '../../components/home-tile';
import PersonIcon from '@mui/icons-material/Person';

const Account = () => {
	return (
		<HomeTile
			icon={<PersonIcon fontSize="large" />}
			label="Account"
			onTileClick={() => console.log('Click')}
		/>
	);
};

export default Account;
