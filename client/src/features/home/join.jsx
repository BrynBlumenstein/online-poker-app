import HomeTile from './home-tile';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

const Join = () => {
	return (
		<HomeTile
			level="top"
			icon={<TravelExploreIcon fontSize="large" />}
			label="Join a Table"
			onTileClick={() => console.log('Click')}
		/>
	);
};

export default Join;
