import sendEmail from "../configs/nodemailer.js";

(async () => {
  try {
    const testEmail = {
      to: "test@example.com", // Replace with your email
      subject: "Test Email",
      body: "This is a test email from the Movie Ticket Booking app."
    };

    const response = await sendEmail(testEmail);
    console.log("Test email sent successfully:", response);
  } catch (error) {
    console.error("Error sending test email:", error);
  }
})();