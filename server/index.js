import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/connectDB.js';
import cors from 'cors';

/* Import routers here */
import AuthRouter from './routes/Auth.js'
import ProjectRouter from './routes/Project.js';
import errorRoute from './middleware/Error.js';
import UserRouter from './routes/User.js';
import status from './utility/status.js';
import InviteRouter from './routes/Invite.js';

import { Server } from 'socket.io';
import {createServer} from 'http';
import loadWebSockets from './socketIO/registerSockets.js';
import NotificationRouter from './routes/Notification.js';


//get environment variables
const app = express();

const server = createServer(app);
const io = new Server(server,{
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
        transports: ['websocket', 'polling'],
    },
allowEIO3: true});
app.set('socketio', io)


dotenv.config({path:'./environments/environments.env'});
connectDB();

app.use(express.json());
app.use(cors({origin:'*'}));


/* Mount the routers and their controllers */
app.use('/api/v1/auth', AuthRouter);
app.use('/api/v1/projects', ProjectRouter);
app.use('/api/v1/users',UserRouter);
app.use('/api/v1/invite',InviteRouter);
app.use('/api/v1/notifications', NotificationRouter);


//catch all route
app.use('*',(req,res)=> {
    res.status(status.NOT_FOUND).json({
        error: 'Route not found'
    });
});



//mount custom error route
app.use(errorRoute);




server.listen(3030,()=> {
    console.log('backend is up and running');
}); 

loadWebSockets(io);
