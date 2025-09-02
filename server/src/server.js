const { createServer } = require('node:http');
const { Server } = require('socket.io');
const app = require('./app');
const registerSocketHandlers = require('./socket');
const verifyToken = require('./utils/verify-token');

const reactAppUrl = 'http://localhost:5173';

const server = createServer(app);

const io = new Server(server, {
	cors: {
		origin: reactAppUrl,
		methods: ['GET', 'POST']
	}
});

io.use((socket, next) => {
	const token = socket.handshake.auth?.token;
	if (!token) {
		return next(new Error('Authentication error'));
	}

	try {
		const user = verifyToken(token);
		socket.userId = user.id;
		socket.username = user.username;
		next();
	} catch (err) {
		next(new Error('Authentication error'));
	}
});

registerSocketHandlers(io);

module.exports = { server, io };
