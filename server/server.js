import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './DB/index.js';
import { clerkWebhooks } from './controllers/User.controller.js';

dotenv.config()
const app=express()


//middleware
app.use(cors())

//db function
connectDB()

//routes
app.get('/',(req,res)=>{
    res.send('API is working!')
})
app.post('/clerk',express.json(), clerkWebhooks)

//server is running on
const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})