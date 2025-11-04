import Booking from '../models/Booking.js';
import Show from '../models/Show.js';

// Scan for expired unpaid bookings and release their seats, then delete the booking.
// This runs periodically as a fallback/ensure mechanism because MongoDB TTL
// deletes documents directly (bypassing Mongoose middleware) and won't
// allow us to run application logic to release seats.
export const cleanupExpiredBookings = async () => {
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
          // release seats recorded in booking.bookedseats
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

// Start an interval that runs cleanupExpiredBookings every minute.
// Exported here for convenience; importing this module has no side effects.
export const startCleanupInterval = (intervalMs = 60 * 1000) => {
  // Run once immediately, then on interval
  cleanupExpiredBookings().catch((e) => console.error('[cleanup] initial run failed', e));
  const id = setInterval(() => {
    cleanupExpiredBookings().catch((e) => console.error('[cleanup] periodic run failed', e));
  }, intervalMs);
  return () => clearInterval(id);
};
