const http = require('http');
const express = require('express');
const {Server: SocketServer} = require('socket.io');
const path = require('path');

const app = express();
const httpServer = http.createServer(app);
const io = new SocketServer(httpServer);

// express.js endpoints

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'views/', 'index.html'));
});

// socket.io endpoints

io.on('connection', (socket) => {
	socket.on('direction-request', () => {
		io.emit('direction-update', Math.random() > 0.5 ? 'left' : 'right');
	});
});

httpServer.listen(2002);
