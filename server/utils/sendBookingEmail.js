import nodemailer from 'nodemailer';

const DISABLED = process.env.DISABLE_EMAILS === 'true' || process.env.STOP_EMAILS === 'true';

let transporter = null;
if (!DISABLED && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
} else {
  if (DISABLED) console.log('[mail] Email sending disabled via DISABLE_EMAILS/STOP_EMAILS');
  else console.log('[mail] EMAIL_USER or EMAIL_PASS not set — mailer not configured');
}

export async function sendBookingEmail(booking, user) {
  // Basic guard
  if (DISABLED) return null;
  if (!booking || !user) return null;
  if (booking.user && user._id && booking.user.toString && booking.user.toString() !== user._id.toString()) return null;

  const movieTitle = booking?.show?.movie?.title || 'your movie';
  const seats = Array.isArray(booking.bookedseats) ? booking.bookedseats.join(', ') : '';
  const showDate = booking?.show?.showDateTime ? new Date(booking.show.showDateTime).toString() : '';

  const mailOptions = {
    from: `hd-moviehub <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: 'Your Movie Ticket Confirmation',
    text: `Your booking is confirmed.\n\nMovie: ${movieTitle}\nSeats: ${seats}\nDate/Time: ${showDate}\nTotal: ₹${booking.amount || ''}`,
  };

  if (!transporter) {
    console.log('[mail] transporter not configured, skipping sendBookingEmail', mailOptions);
    return null;
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Booking confirmation email sent:', info && info.response ? info.response : info);
    return info;
  } catch (err) {
    console.error('Error sending booking confirmation email:', err);
    throw err;
  }
}
