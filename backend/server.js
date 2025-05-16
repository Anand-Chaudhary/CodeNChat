import app from "./app.js";
import http from 'http';
import {Server} from 'socket.io';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import Project from "./models/project.model.js";
import { getResult } from "./controller/ai.controller.js";

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

        const project = await Project.findById(projectID).lean();
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
    socket.roomId = socket.project._id.toString();
  console.log('New client connected');
  socket.join(socket.roomId)

  socket.on('project-message', async data => { 
    const message = data.message || "";
    const callForAI = message.includes("@AI");

    if(callForAI){
        const prompt = message.replace("@AI", "").trim();
        
        const result = await getResult(prompt).catch(error => {
            console.error(error);
            return "AI encountered an error processing your request.";
        });
        console.log(`AI Response: ${result}`);
        

    io.to(socket.roomId).emit('project-message', { 
        message: result, 
        sender:"AI"
    });
    }

    
    
    socket.broadcast.to(socket.roomId).emit('project-message', data);
    console.log(`Message ${data} in project ${socket.project._id}: ${data}`);
    
  });

  socket.on('event', data => { /* … */ });
  socket.on('disconnect', () => {
    console.log('Client disconnected');
    socket.leave(socket.roomId);
   });
  
});

server.listen(PORT, ()=>{    
    console.log(`Server Running on ${PORT}`);   
});