const express = require('express');
const app = express();
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const port = process.env.PORT | 5000;
const httpServer = createServer(app);


const allowOrigin = [
    'http://localhost:5173'
]

const corsOptions = {
    origin: allowOrigin, // Your React client's URL
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Best for REST APIs
    optionsSuccessStatus: 200, // For legacy browser support
    credentials: true
};

const io = new Server(httpServer, {
    cors: {
        origin: allowOrigin,
        methods: ['GET', 'POST'],
        credentials: true
    }
})



app.use(cors(corsOptions));
app.use(express.json())


io.on('connection', (socket) => {
    console.log('new user connected:', socket.id );
    socket.emit('welcome', 'Welcome to everyone!')

    // io.emit('hello', `New Guest Join ${socket.id}`);

    socket.on('message', (data) => {
        console.log(data)
        // io.emit('msg-show', data);

        // socket.broadcast.emit('msg-show', data);

        //for specific person send io/socket does not matter, but we will used io 

        io.to(data.room).emit('msg-show', data)

    })

    socket.on('disconnect', () => {
        console.log('user disconnected!', socket.id)
    })
})



httpServer.listen(port, () => [
    console.log(`Server onpen in ${port} port`)
])