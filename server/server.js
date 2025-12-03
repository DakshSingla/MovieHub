import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import { serve } from "inngest/express";
import { clerkMiddleware, requireAuth } from '@clerk/express';
import { inngest, functions } from "./inngest/index.js"
import Booking from './models/Booking.js';
import Show from './models/Show.js';
import showoRouter from './routes/showRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import userRouter from './routes/userRoutes.js';
// Stripe removed from project - webhook controller deleted

const app = express();
const port = 3000;

await connectDB();
// Stripe webhook route removed (Stripe integration disabled)

app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())

app.get('/', (req, res)=> res.send('Server is Live!'));

app.use('/api/inngest', serve({client: inngest, functions}))
app.use('/api/show', showoRouter)
app.use('/api/booking', bookingRouter);
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter)

app.listen(port, ()=>console.log(`Server listening at http://localhost:${port}`));