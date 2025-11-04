import nodemailer from 'nodemailer';

const DISABLED = process.env.DISABLE_EMAILS === 'true' || process.env.STOP_EMAILS === 'true';

const transporter = (!DISABLED && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SENDER_EMAIL) ? nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
  port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
}) : null;

const sendEmail = async ({ to, subject, body }) => {
  if (DISABLED) {
    console.log('[mail] DISABLE_EMAILS is true — skipping sendEmail to', to);
    return null;
  }

  if (!transporter) {
    console.warn('[mail] transporter not configured (SMTP creds missing) — skipping sendEmail to', to);
    return null;
  }

  const response = await transporter.sendMail({
    from: process.env.SENDER_EMAIL,
    to,
    subject,
    html: body,
  });

  return response;
};

export default sendEmail;
// export async function sendBookingEmail(booking, user) {
//   if (!booking || !user || booking.user.toString() !== user._id.toString()) return;

//   const mailOptions = {
//     from: 'hd-moviehub <' + process.env.EMAIL_USER + '>',
//     to: user.email,
//     subject: 'Your Movie Ticket Confirmation',
//     text: `Welcome to HD-MovieHub!\n\nYour booking is confirmed.\n\nMovie: ${booking.show.movie.title}\nSeats: ${Array.isArray(booking.bookedseats) ? booking.bookedseats.join(', ') : ''}\nTotal Price: ₹${booking.amount}\nDate: ${booking.show.showDateTime}\n\nEnjoy your movie experience!\n\nRegards,\nHD-MovieHub Team`
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log('Booking confirmation email sent:', info.response);
//     return info;
//   } catch (err) {
//     console.error('Error sending booking confirmation email:', err);
//     throw err;
//   }
// }