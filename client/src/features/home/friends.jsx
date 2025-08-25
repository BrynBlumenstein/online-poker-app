import HomeTile from '../../components/home-tile';
import GroupIcon from '@mui/icons-material/Group';

const Friends = () => {
	return (
		<HomeTile
			icon={<GroupIcon fontSize="large" />}
			label="Friends"
			onTileClick={() => console.log('Click')}
		/>
	);
};

export default Friends;
