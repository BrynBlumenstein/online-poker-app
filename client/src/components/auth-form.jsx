import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const AuthForm = ({ onSubmit, buttonLabel }) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
    const navigate = useNavigate();

	const handleSubmit = async (event) => {
		event.preventDefault();
		await onSubmit(username, password);

		setUsername('');
		setPassword('');

        navigate('/');
	};

	return (
		<Box
			component="form"
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
				required
				size="small"
                value={username}
				onChange={({ target }) => {
					setUsername(target.value);
				}}
			/>
			<TextField
				label="Password"
				type="password"
				required
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
