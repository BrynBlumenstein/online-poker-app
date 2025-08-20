import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import AuthForm from '../components/auth-form';
import { useNavigate } from 'react-router-dom';

const AuthPage = ({
	label,
	onSubmit,
	redirectText,
	redirectPath,
	redirectLabel
}) => {
	const navigate = useNavigate();

	return (
		<Box
			sx={{
				height: '100vh',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center'
			}}
		>
			<Paper
				elevation={6}
				sx={{
					p: 4,
					width: 400
				}}
			>
				<Typography variant="h5" align="center" gutterBottom>
					{label}
				</Typography>
				<AuthForm onSubmit={onSubmit} buttonLabel={label} />
				<Typography>
					{redirectText}
					<Link onClick={() => navigate(redirectPath)}>
						{redirectLabel}
					</Link>
				</Typography>
			</Paper>
		</Box>
	);
};

export default AuthPage;
