const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { createServer } = require('http');
const { Server } = require('socket.io');
const port = process.env.PORT | 5000;
const httpServer = createServer(app);
const SECRET_KEY = 'jdieddjdkdidjdkeejdiemek';
const cookie = require('cookie'); // ✅ Import cookie package


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



app.post('/login', (req, res) => {
    const user = { id: 1, username: 'Barry' }; // Example user

    // Create JWT
    const token = jwt.sign(user, SECRET_KEY, { expiresIn: '1h' });

    // Set token in HTTP-only cookie
    res.cookie('token', token, {
        httpOnly: true, // Prevents client-side JavaScript access
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });

    res.json({ message: 'Logged in!' });
});


io.use((socket, next) => {
    const cookies = socket.handshake.headers.cookie;

    const parsedCookies = cookie.parse(cookies || '');
    const token = parsedCookies.token;
    if (!token) {
        return next(new Error("Authentication error - No token found"));
    };

    jwt.verify(token, SECRET_KEY, (error, decoded) => {
        if(error){
            return next(new Error('Invalid token'));
        }

        socket.user = decoded;
        next()

    });

});


io.on('connection', (socket) => {
    console.log('new user connected:', socket.id);
    console.log(' user connected info:', socket.user);
    socket.emit('welcome', 'Welcome to everyone!')

    // io.emit('hello', `New Guest Join ${socket.id}`);

    socket.on('message', (data) => {
        console.log(data)
        // io.emit('msg-show', data);

        // socket.broadcast.emit('msg-show', data);

        //for specific person send io/socket does not matter, but we will used io 

        io.to(data.room).emit('msg-show', data)

    });

    socket.on('Jonin-room', (data) => {
        // console.log(data)
        socket.join(data)
    })




    socket.on('disconnect', () => {
        console.log('user disconnected!', socket.id)
    })
})



httpServer.listen(port, () => [
    console.log(`Server onpen in ${port} port`)
])