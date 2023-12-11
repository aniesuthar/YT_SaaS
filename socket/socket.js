const { Server } = require('socket.io');
const http = require('http');

const server = http.createServer();

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket'], // Specify WebSocket as the primary transport
});


let users = [];

const addUser = (userData, socketId) => {
    !users.some(user => user.id === userData.id) && users.push({ ...userData, socketId });
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
}

const getUser = (userId) => {
    return users.find(user => user.id === userId);
}

io.on('connection', (socket) => {
    console.log('user connected', socket.id);

    
    //connect
    socket.on("addUser", userData => {
        addUser(userData, socket.id);
        io.emit("getUsers", users)
        console.log("Users are:", users);
    })

    //send message
    socket.on('sendMessage', (data) => {
        const user = getUser(data.receiverId);
        console.log("socekt SendMessage envoked", data, user);
        // io.to(user.socketId).emit('getMessage', data);
    })

    //disconnect
    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
        removeUser(socket.id);
        io.emit('getUsers', users);
    })
})


const PORT = 8009;
server.listen(PORT, () => {
  console.log(`Socket server is running on port ${PORT}`);
});