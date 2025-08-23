import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Typography from '@mui/material/Typography';

const AuthForm = ({
	onSubmit,
	buttonLabel,
	usernameHelperText,
	passwordHelperText,
	usernameError,
	passwordError
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
		const response = await onSubmit(username, password);
		if (response) {
			setUsername('');
			setPassword('');
			navigate('/');
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
				error={usernameError}
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
				error={passwordError}
			/>
			<Button type="submit" variant="contained">
				{buttonLabel}
			</Button>
		</Box>
	);
};

export default AuthForm;
