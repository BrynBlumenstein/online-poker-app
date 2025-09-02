import { io } from 'socket.io-client';

const serverUrl = 'http://localhost:3001/';

const ONE_SECOND = 1000;

const createSocket = (token) => {
	return io(serverUrl, {
		autoConnect: false,
		auth: { token },
		transports: ['websocket'],
		reconnectionAttempts: 5,
		reconnectionDelay: ONE_SECOND
	});
};

export default createSocket;
