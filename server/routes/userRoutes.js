import express from "express";
import { getFavorites, getUserBookings, updateFavorite } from "../controllers/userController.js";
import { requireAuth } from '@clerk/express';

const userRouter = express.Router();

// Protect bookings and favorites endpoints — require user to be authenticated
userRouter.get('/bookings', requireAuth(), getUserBookings);
userRouter.post('/update-favorite', requireAuth(), updateFavorite);
userRouter.get('/favorites', requireAuth(), getFavorites);

export default userRouter;