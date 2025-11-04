import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import User from "../models/User.js";
import sendEmail from '../configs/nodemailer.js';
import { inngest } from '../inngest/index.js';

const checkSeatsAvailability = async (showId, selectedSeats) => {
    try{
        const showData = await Show.findById(showId);
            if (!showData) {
                throw new Error("Show not found");
            }
            const occupiedSeats = showData.occupiedSeats;;
            const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);
            return !isAnySeatTaken; // Return true if all seats are available
        } catch (error) {
            console.error(error.message);
            return false;
        }
}

export const createBooking = async (req, res)=> {
    try{
    // Ensure we safely extract the logged-in user's id from the Clerk auth helper
    const authInfo = req.auth && typeof req.auth === 'function' ? req.auth() : req.auth;
    const userId = authInfo?.userId || authInfo?.user || null;
    const {showId , selectedSeats , amount} = req.body;
        const {origin} = req.headers;

        // Check seat availability;

        const isAvailable = await checkSeatsAvailability(showId, selectedSeats);
        if (!isAvailable) {
            return res.json({ error: "Selected seats are not available" });
        }

        // Proceed with booking creation

        const showData = await Show.findById(showId).populate('movie');
        const booking = await Booking.create({
            user: userId,
            show: showId,
            amount: showData.showPrice * selectedSeats.length,
            bookedseats: selectedSeats,
            isPaid: false,
            // Set expiry 10 minutes from now; MongoDB TTL index will remove it
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        })

        // Populate booking with show and movie before using it in emails or events
        const populatedBooking = await Booking.findById(booking._id).populate({ path: 'show', populate: { path: 'movie' } });

        // Send booking confirmation email to the logged-in user only
        const user = await User.findById(userId);
        if (user && populatedBooking && populatedBooking.user.toString() === user._id.toString()) {
            try {
                // Use central nodemailer config. sendEmail is a safe no-op when
                // DISABLE_EMAILS=true or SMTP creds are not configured.
                const subject = `Your booking for ${populatedBooking.show.movie.title} is confirmed`;
                const seats = Array.isArray(populatedBooking.bookedseats) ? populatedBooking.bookedseats.join(', ') : '';
                const body = `<p>Hi ${user.name || ''},</p>
                <p>Your booking is confirmed.</p>
                <p><strong>Movie:</strong> ${populatedBooking.show.movie.title}</p>
                <p><strong>Seats:</strong> ${seats}</p>
                <p><strong>Total:</strong> ₹${populatedBooking.amount}</p>`;
                await sendEmail({ to: user.email, subject, body });
            } catch (emailErr) {
                console.error('Error sending booking email:', emailErr);
                // continue without failing the booking
            }
        }
        selectedSeats.map((seat) => {
            showData.occupiedSeats[seat] = true;
        })
        showData.markModified('occupiedSeats');
        await showData.save();

        // Notify Inngest to check payment status (will wait 10 minutes then run)
        try {
            await inngest.send({ name: 'app/checkpayment', data: { bookingId: booking._id.toString() } })
        } catch (err) {
            console.error('Failed to send Inngest event for booking:', booking._id, err);
        }

        // DEMO PAYMENT MODE: Do not use Stripe, just return the populated booking for the client
        return res.json({ success: true, booking: populatedBooking });
    } catch (error) {
        console.error(error.message);
        return res.json({ error: "Internal server error" });
    }
}

export const getOccupiedSeats = async (req, res) => {
    try {
        const { showId } = req.params;
        const showData = await Show.findById(showId);
        const occupiedSeats = Object.keys(showData.occupiedSeats);
        if (!showData) {
            return res.json({ error: "Show not found" });
        }
        res.json({ success: true, occupiedSeats });
    } catch (error) {
        console.error(error.message);
        return res.json({ success: false, message:error.message });
    }
}

// Add your booking controller logic here
