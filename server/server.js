import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './DB/index.js';
import { clerkMiddleware } from '@clerk/express';
import connectCloudinary from './configs/cloudinary.js';

dotenv.config()
const app = express()


//middleware
app.use(cors())
app.use(clerkMiddleware())

app.use(express.json())

//db function
await connectDB()

//cloudinary connect function
await connectCloudinary()

//import of routes from routes folder:
import { clerkWebhooks, stripeWebhooks } from './controllers/Webhook.controller.js';
import educatorRouter from './routes/Educator.route.js';
import courseRouter from './routes/Course.route.js';
import userRouter from './routes/User.route.js';


//routes:
app.get('/', (req, res) => {
    res.send('API is working!')
})

app.post('/clerk', clerkWebhooks)
app.use('/api/educator', educatorRouter)
app.use('/api/course', courseRouter)
app.use('/api/user', userRouter)
app.post('/stripe',express.raw({ type: 'application/json' }),stripeWebhooks);

//server is running on
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})