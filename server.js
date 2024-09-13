const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const httpServer = http.createServer();

const crypto = require('crypto');
const randomId = () => crypto.randomBytes(8).toString('hex');

const { InMemorySessionStore } = require('./sessionStore');
const { InMemoryMessageStore } = require('./messageStore');
const sessionStore = new InMemorySessionStore();
const messageStore = new InMemoryMessageStore();

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
        userId: socket.userId,
        userName: socket.userName,
        connected: true,
    });

    // Fetching existing messages

    const users = [];
    const messagesPerUser = new Map();
    messageStore.findMessagesForUser(socket.userId).forEach((message) => {
        const { from, to } = message;
        const otherUser = socket.userId === from ? to : from;
        if (messagesPerUser.has(otherUser)) {
            messagesPerUser.get(otherUser).push(message);
        } else {
            messagesPerUser.set(otherUser, [message]);
        }
    });

    sessionStore.findAllSessions().forEach((session) => {
        users.push({
            userId: session.userId,
            userName: session.userName,
            connected: session.connected,
            messages: messagesPerUser.get(session.userId) || [],
        });
    });

    socket.emit('users', users);

    // Register a client listener to manually query all connected clients info if needed

    socket.on('get_users', () => {
        socket.emit('users', users);
    });

    socket.on('send_message', ({ content, from, to, time }) => {
        console.log(`Server sending message from ${socket.userId}`);

        // Persisting the message in the local store
        const message = {
            content,
            from,
            to,
            time,
        };

        socket.to(to).to(socket.userId).emit('receive_message', message);
        console.log(`Server sending message to ${to}`);
        messageStore.saveMessage(message);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.userId);
        socket.broadcast.emit('another_user_disconnected', {
            userId: socket.userId,
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
