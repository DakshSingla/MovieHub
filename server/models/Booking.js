import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: { type: String, required: true, ref: 'User' },
    show: { type: String, required: true, ref: 'Show'},
    amount: { type: Number, required: true },
    bookedseats: { type: Array, required: true },
    isPaid: { type: Boolean,default: false },
    // expiresAt will be used by a MongoDB TTL index to automatically remove
    // unpaid bookings after a short window (set when booking is created)
    expiresAt: { type: Date },
    paymentLink: { type: String},
}, { timestamps: true })

// Automatically remove documents when `expiresAt` is reached.
// expireAfterSeconds: 0 means remove at the exact time in the field.
bookingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;