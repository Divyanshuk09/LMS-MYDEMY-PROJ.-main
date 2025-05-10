import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './DB/index.js';
import { clerkMiddleware } from '@clerk/express';
import connectCloudinary from './configs/cloudinary.js';

dotenv.config();
const app = express();

// Middleware Configuration
// -----------------------
// Important: Stripe webhook needs raw body, so we'll configure it specially
app.use(cors());
app.use(clerkMiddleware());

// Regular JSON parser for most routes (EXCEPT Stripe webhook)
app.use((req, res, next) => {
  if (req.originalUrl === '/stripe') {
    next();
  } else {
    express.json()(req, res, next); 
  }
});

// Database and Cloudinary Connections
await connectDB();
await connectCloudinary();

// Route Imports
import { clerkWebhooks, stripeWebhooks } from './controllers/Webhook.controller.js';
import educatorRouter from './routes/Educator.route.js';
import courseRouter from './routes/Course.route.js';
import userRouter from './routes/User.route.js';

// Route Definitions
app.get('/', (req, res) => {
  res.send('API is working!');
});

// Clerk webhook (uses regular JSON)
app.post('/clerk', clerkWebhooks);

// API Routes
app.use('/api/educator', educatorRouter);
app.use('/api/course', courseRouter);
app.use('/api/user', userRouter);

// Stripe Webhook - MUST use raw body
app.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  stripeWebhooks
);

// Server Startup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});