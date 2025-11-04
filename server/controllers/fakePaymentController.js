import Booking from '../models/Booking.js';
import axios from 'axios';
import User from '../models/User.js';
import { sendBookingEmail } from '../utils/sendBookingEmail.js';
import { inngest } from '../inngest/index.js';

export const fakePayBooking = async (req, res) => {
  try {
    console.log('fakePayBooking endpoint called');
    const { bookingId } = req.params;
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { isPaid: true, paymentLink: '', expiresAt: null },
      { new: true }
    ).populate({ path: 'show', populate: { path: 'movie' } });
    if (!booking) {
      console.log('Booking not found for ID:', bookingId);
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    // Notify Inngest (worker) to run post-payment tasks such as sending
    // a confirmation email. This is safe to try even if send fails.
    try {
      await inngest.send({ name: 'app/show.booked', data: { bookingId: booking._id.toString() } });
    } catch (err) {
      console.error('Failed to send Inngest event for booking confirmation:', err);
    }
    // Fetch user email from Clerk
    let clerkUser = null;
    try {
      const clerkRes = await axios.get(`https://api.clerk.com/v1/users/${booking.user}`, {
        headers: {
          'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      });
      clerkUser = clerkRes.data;
    } catch (err) {
      console.error('Error fetching user from Clerk:', err?.response?.data || err.message);
    }
    const userEmail = clerkUser?.email_addresses?.[0]?.email_address;
    console.log('About to send booking email to:', userEmail);
    if (userEmail) {
      await sendBookingEmail(booking, { ...clerkUser, email: userEmail, _id: booking.user });
      console.log('sendBookingEmail called');
    }
  // Always return booking with populated show and movie
  const populatedBooking = await Booking.findById(booking._id).populate({ path: 'show', populate: { path: 'movie' } });
  res.json({ success: true, booking: populatedBooking });
  } catch (error) {
    console.error('Error in fakePayBooking:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
