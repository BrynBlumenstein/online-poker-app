import HomeTile from './home-tile';
import TableBarIcon from '@mui/icons-material/TableBar';

const Host = () => {
	return (
		<HomeTile
			level="top"
			icon={<TableBarIcon fontSize="large" />}
			label="Host a Table"
			onTileClick={() => console.log('Click')}
		/>
	);
};

export default Host;
