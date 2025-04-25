import app from "./app.js";
import http from 'http';
import {Server} from 'socket.io';
import jwt from 'jsonwebtoken';

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server);

io.use((socket, next) => {
    try {
        
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];
        if (!token) {
            return next(new Error('Authentication error'));
        } 

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) {
            return next(new Error('Authentication error'));
        }
        socket.user = decoded;

    } catch (error) {
        next(error)
    }
})

io.on('connection', socket => {
  socket.on('event', data => { /* … */ });
  socket.on('disconnect', () => { /* … */ });
  console.log('New client connected');
  
});

server.listen(PORT, ()=>{    
    console.log(`Server Running on ${PORT}`);   
});