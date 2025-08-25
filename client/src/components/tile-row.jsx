import Stack from '@mui/material/Stack';

const TileRow = ({ children }) => {
	return (
		<Stack direction="row" justifyContent="center" spacing={6}>
			{children}
		</Stack>
	);
};

export default TileRow;
