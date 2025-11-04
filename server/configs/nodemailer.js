import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host : "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendEmail = async({to, subject, body})=>{
    const response = await transporter.sendMail({
        from : process.env.SENDER_EMAIL,
        to,
        subject,
        html: bode,
    })
    return response
}
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