import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/connectDB.js';
import bodyparser from 'body-parser';
import cors from 'cors';

/* Import routers here */
import AuthRouter from './routes/Auth.js'
import ProjectRouter from './routes/Project.js';
import errorRoute from './middleware/Error.js';
import UserRouter from './routes/User.js';

//get environment variables
const app = express();
dotenv.config({path:'./environments/environments.env'});
connectDB();

app.use(express.json());
app.use(cors({
    origin:'*',
}));


/* Mount the routers and their controllers */
app.use('/api/v1/auth', AuthRouter);
app.use('/api/v1/projects', ProjectRouter);
app.use('/api/v1/users',UserRouter);
app.use(errorRoute);




app.listen(3030,()=> {
    console.log('backend is up and running');
}); 