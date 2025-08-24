import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const AuthForm = ({
	onSubmit,
	buttonLabel,
	usernameHelperText,
	passwordHelperText,
}) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const handleMouseUpPassword = (event) => {
		event.preventDefault();
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		const successfulSubmit = await onSubmit(username, password);
		if (successfulSubmit) {
			setUsername('');
			setPassword('');
			navigate('/', { replace: true });
		}
	};

	return (
		<Box
			component="form"
			noValidate
			onSubmit={handleSubmit}
			sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: 2,
				p: '1rem 0'
			}}
		>
			<TextField
				label="Username"
				helperText={usernameHelperText}
				required
				size="small"
				value={username}
				onChange={({ target }) => {
					setUsername(target.value);
				}}
			/>
			<TextField
				label="Password"
				helperText={passwordHelperText}
				required
				type={showPassword ? 'text' : 'password'}
				slotProps={{
					input: {
						endAdornment: (
							<InputAdornment position="end">
								<IconButton
									onClick={handleClickShowPassword}
									onMouseDown={handleMouseDownPassword}
									onMouseUp={handleMouseUpPassword}
									edge="end"
								>
									{showPassword ? (
										<VisibilityOff />
									) : (
										<Visibility />
									)}
								</IconButton>
							</InputAdornment>
						)
					}
				}}
				size="small"
				value={password}
				onChange={({ target }) => {
					setPassword(target.value);
				}}
			/>
			<Button type="submit" variant="contained">
				{buttonLabel}
			</Button>
		</Box>
	);
};

export default AuthForm;
