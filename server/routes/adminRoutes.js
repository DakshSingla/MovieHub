import express from 'express';
import { getAllBookings, getAllShows, getDashboardData, isAdmin } from '../controllers/adminController.js';
import { protectAdmin } from '../middleware/auth.js';
import { requireAuth } from '@clerk/express';

const adminRouter = express.Router();

adminRouter.get('/is-admin', requireAuth(), protectAdmin, isAdmin);

adminRouter.get('/dashboard', requireAuth(), protectAdmin, getDashboardData);

adminRouter.get('/shows', requireAuth(), protectAdmin, getAllShows);

adminRouter.get('/bookings', requireAuth(), protectAdmin, getAllBookings);

export default adminRouter;