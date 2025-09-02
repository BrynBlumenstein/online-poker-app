import { useRef, useState, useEffect } from 'react';
import createSocket from '../../utils/socket-factory';
import useAuth from '../auth/use-auth';
import tokenService from '../../services/token-service';
import SocketContext from './socket-context';

const SocketProvider = ({ children }) => {
	const { user } = useAuth();
	const socketRef = useRef(null);
	const [connected, setConnected] = useState(false);

	useEffect(() => {
		const token = tokenService.get();

		if (!user || !token) {
			if (socketRef.current) {
				socketRef.current.disconnect();
				socketRef.current = null;
				setConnected(false);
			}
			return;
		}

		const socket = createSocket(token);
		socketRef.current = socket;

		const onConnect = () => {
			setConnected(true);
		};
		const onDisconnect = () => {
			setConnected(false);
		};
		const onConnectError = (err) => {
			console.error('Socket connect_error', err?.message || err);
		};

		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);
		socket.on('connect_error', onConnectError);

		socket.connect();

		return () => {
			socket.off('connect', onConnect);
			socket.off('disconnect', onDisconnect);
			socket.off('connect_error', onConnectError);
			socket.disconnect();
			socketRef.current = null;
			setConnected(false);
		};
	}, [user]);

	return (
		<SocketContext.Provider
			value={{ socket: socketRef.current, connected }}
		>
			{children}
		</SocketContext.Provider>
	);
};

export default SocketProvider;
