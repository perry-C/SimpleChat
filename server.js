const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const httpServer = http.createServer();

const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000', // Replace with your frontend URL
        methods: ['GET', 'POST'],
        allowedHeaders: ['my-custom-header'],
        credentials: true,
    },
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`user with id-${socket.id} joined room - ${roomId}`);
    });

    socket.on('send_msg', (data) => {
        console.log(data, 'DATA');
        //This will send a message to a specific room ID
        socket.to(data.roomId).emit('receive_msg', data);
    });

    socket.on('query_friends_list', async () => {
        const users = [];
        for ([id, socket] of io.of('/').sockets) {
            users.push({
                userId: id,
                userName: socket.userName,
            });
        }
        socket.emit('receive_friends_list', users);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

// Register the a middleware for user name authentication
io.use((socket, next) => {
    const userName = socket.handshake.auth.userName;
    if (!userName) {
        return next(new Error('invalid username'));
    }
    socket.userName = userName;
    next();
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`Socket.io server is running on port ${PORT}`);
});
