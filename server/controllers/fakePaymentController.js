import Booking from '../models/Booking.js';
import axios from 'axios';
import User from '../models/User.js';
import sendEmail from '../configs/nodemailer.js';
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
      try {
        const subject = `Your booking for ${booking.show.movie.title} is confirmed`;
        const seats = Array.isArray(booking.bookedseats) ? booking.bookedseats.join(', ') : '';
        const body = `<p>Hi ${clerkUser?.first_name || ''},</p>
          <p>Your booking is confirmed.</p>
          <p><strong>Movie:</strong> ${booking.show.movie.title}</p>
          <p><strong>Seats:</strong> ${seats}</p>
          <p><strong>Total:</strong> ₹${booking.amount}</p>`;
        await sendEmail({ to: userEmail, subject, body });
        console.log('sendEmail (nodemailer) called');
      } catch (err) {
        console.error('Error sending booking email via sendEmail:', err);
      }
    }
  // Always return booking with populated show and movie
  const populatedBooking = await Booking.findById(booking._id).populate({ path: 'show', populate: { path: 'movie' } });
  res.json({ success: true, booking: populatedBooking });
  } catch (error) {
    console.error('Error in fakePayBooking:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
