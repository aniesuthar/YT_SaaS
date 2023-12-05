const { Server } = require('socket.io');

const io = new Server(8002, {
    cors: {
        origin: "http://localhost:3000",
    }
})



io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle WebSocket events here
    // You can emit messages or updates to connected clients
    // For example: socket.emit('progress', { progressString });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

module.exports = io;