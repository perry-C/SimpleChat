const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const httpServer = http.createServer();

const crypto = require('crypto');
const randomId = () => crypto.randomBytes(8).toString('hex');

const { InMemorySessionStore } = require('./sessionStore');
const sessionStore = new InMemorySessionStore();

const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000', // Replace with your frontend URL
        methods: ['GET', 'POST'],
        allowedHeaders: ['my-custom-header'],
        credentials: true,
    },
});

io.use((socket, next) => {
    console.log('Calling middleware for persisting session');
    const sessionId = socket.handshake.auth.sessionId;

    if (sessionId) {

        // find existing session
        const session = sessionStore.findSession(sessionId);

        if (session) {
            socket.sessionId = sessionId;
            socket.userId = session.userId;
            socket.userName = session.userName;
            return next();
        }
    }

    const userName = socket.handshake.auth.userName;
    if (!userName) {
        return next(new Error('invalid userName'));
    }
    // create new session
    socket.sessionId = randomId();
    socket.userId = randomId();
    socket.userName = userName;

    next();
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    console.log('The session id of the user is', socket.sessionId);

    // persist session
    sessionStore.saveSession(socket.sessionId, {
        userId: socket.userId,
        userName: socket.userName,
        connected: true,
    });

    // emit session details
    socket.emit('session', {
        sessionId: socket.sessionId,
        userId: socket.userId,
    });

    socket.join(socket.userId);

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
        // update the connection status of the session
        sessionStore.saveSession(socket.sessionId, {
            userId: socket.userId,
            userName: socket.userName,
            connected: false,
        });
    });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`Socket.io server is running on port ${PORT}`);
});
