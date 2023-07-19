import express from 'express';
import connectDB from './db/connectDB';
import dotenv from 'dotenv';


const app = express();
connectDB();








app.listen(3030,()=> {
    console.log('backend is up and running');
});