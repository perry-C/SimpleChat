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

    // notify existing users
    socket.broadcast.emit('another_user_connected', {
        userId: socket.id,
        userName: socket.userName,
        connected: true,
    });

    socket.on('query_friends_list', () => {
        const users = [];
        for ([id, socket] of io.of('/').sockets) {
            users.push({
                userId: id,
                userName: socket.userName,
                connected: true,
            });
        }
        socket.emit('receive_friends_list', users);
    });

    socket.on('send_message', ({ message, to }) => {
        console.log(`Server sending message from ${socket.id}`);
        socket.to(to).emit('receive_message', message.current);
        console.log(`Server sending message to ${to}`);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
        socket.broadcast.emit('another_user_disconnected', {
            userId: socket.id,
            userName: socket.userName,
            connected: false,
        });
    });
});

// Register the a middleware for user name and password authentication
io.use((socket, next) => {
    const userName = socket.handshake.auth.userName;
    if (!userName) {
        return next(new Error('invalid username'));
    }
    socket.userName = userName;
    next();
});

// io.use((socket, next) => {
//     const sessionID = socket.handshake.auth.sessionID;
//     if (sessionID) {
//         // find existing session
//         const session = sessionStore.findSession(sessionID);
//         if (session) {
//             socket.sessionID = sessionID;
//             socket.userID = session.userID;
//             socket.username = session.username;
//             return next();
//         }
//     }
//     const username = socket.handshake.auth.username;
//     if (!username) {
//         return next(new Error('invalid username'));
//     }
//     // create new session
//     socket.sessionID = randomId();
//     socket.userID = randomId();
//     socket.username = username;
//     next();
// });

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`Socket.io server is running on port ${PORT}`);
});
