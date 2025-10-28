import express from 'express';
import { getAllBookings, getAllShows, getDashboardData, isAdmin } from '../controllers/adminController.js';
import { protectAdmin } from '../middleware/auth.js';

const adminRouter = express.Router();

adminRouter.get('/is-admin', protectAdmin, isAdmin);

adminRouter.get('/dashboard', protectAdmin, getDashboardData);

adminRouter.get('/shows', protectAdmin, getAllShows);

adminRouter.get('/bookings', protectAdmin, getAllBookings);

export default adminRouter;