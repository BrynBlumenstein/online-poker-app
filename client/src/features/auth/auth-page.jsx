import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import AuthForm from './auth-form';

const AuthPage = ({
	onSubmit,
	label,
	usernameHelperText,
	passwordHelperText,
	usernameError,
	passwordError,
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
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center'
			}}
		>
			<Typography variant="h4" gutterBottom>Online Poker App</Typography>
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
				<AuthForm
					onSubmit={onSubmit}
					buttonLabel={label}
					usernameHelperText={usernameHelperText}
					passwordHelperText={passwordHelperText}
					usernameError={usernameError}
					passwordError={passwordError}
				/>
				<Typography>
					{redirectText}
					<Link
						onClick={() => navigate(redirectPath)}
						sx={{ cursor: 'pointer' }}
					>
						{redirectLabel}
					</Link>
				</Typography>
			</Paper>
		</Box>
	);
};

export default AuthPage;
