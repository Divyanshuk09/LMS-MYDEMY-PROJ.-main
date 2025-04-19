import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './DB/index.js';
import { clerkWebhooks } from './controllers/User.controller.js';

dotenv.config()

const app=express()

app.use(cors())
connectDB()

app.get('/',(req,res)=>{
    res.send('API is working!')
})
app.post('/clerk',express.json(), clerkWebhooks)

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})