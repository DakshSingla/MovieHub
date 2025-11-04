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

// --- Cleanup expired unpaid bookings (moved inline; no new files) ---
// Scans for expired unpaid bookings, releases seats on the show, and deletes the booking.
// This runs periodically as a fallback because MongoDB TTL deletes documents directly
// and Inngest scheduled jobs may not run in all environments.
const cleanupExpiredBookings = async () => {
	try {
		const now = new Date();
		const expiredBookings = await Booking.find({ isPaid: false, expiresAt: { $lte: now } });
		if (!expiredBookings || expiredBookings.length === 0) return;

		console.log(`[cleanup] Found ${expiredBookings.length} expired unpaid booking(s) - releasing seats and deleting bookings`);

		for (const booking of expiredBookings) {
			try {
				const showId = booking.show;
				const show = await Show.findById(showId);
				if (show) {
					(booking.bookedseats || []).forEach((seat) => {
						if (show.occupiedSeats && Object.prototype.hasOwnProperty.call(show.occupiedSeats, seat)) {
							delete show.occupiedSeats[seat];
						}
					});
					show.markModified && show.markModified('occupiedSeats');
					await show.save();
				} else {
					console.warn(`[cleanup] Show not found for booking ${booking._id} (show ${showId})`);
				}

				await Booking.findByIdAndDelete(booking._id);
				console.log(`[cleanup] Released seats and deleted booking ${booking._id}`);
			} catch (err) {
				console.error('[cleanup] Error processing booking', booking._id, err && err.message ? err.message : err);
			}
		}
	} catch (err) {
		console.error('[cleanup] Failed to fetch expired bookings', err && err.message ? err.message : err);
	}
};

const startCleanupInterval = (intervalMs = 60 * 1000) => {
	cleanupExpiredBookings().catch((e) => console.error('[cleanup] initial run failed', e));
	const id = setInterval(() => {
		cleanupExpiredBookings().catch((e) => console.error('[cleanup] periodic run failed', e));
	}, intervalMs);
	return () => clearInterval(id);
};

// Start the cleanup interval on server boot.
startCleanupInterval();

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