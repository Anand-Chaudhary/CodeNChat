import app from "./app.js";
import http from 'http';
import {Server} from 'socket.io';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import Project from "./models/project.model.js";

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];
        const projectID = socket.handshake.query.projectID;

        if (!mongoose.Types.ObjectId.isValid(projectID)) {
            return next(new Error('Invalid project ID'));
        }

        const project = await Project.findById(projectID);
        if (!project) {
            return next(new Error('Project not found'));
        }
        socket.project = project;

        if (!token) {
            return next(new Error('Authentication error'));
        } 

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) {
            return next(new Error('Authentication error: Invalid token'));
        }
        socket.user = decoded;
        next();
    } catch (error) {
        next(new Error(`Authentication error: ${error.message}`));
    }
})

io.on('connection', socket => {

  console.log('New client connected');
  socket.join(socket.project._id)

  socket.on('project-message', data => { 
    socket.broadcast.to(socket.project._id.toString()).emit('project-message', data);
    console.log(`Message from ${socket.user.username} in project ${socket.project._id}: ${data}`);
    
  });

  socket.on('event', data => { /* … */ });
  socket.on('disconnect', () => { /* … */ });
  
});

server.listen(PORT, ()=>{    
    console.log(`Server Running on ${PORT}`);   
});