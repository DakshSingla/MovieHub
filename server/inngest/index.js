import { Inngest } from "inngest";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

const syncUserCreation = inngest.createFunction(
    { id: "sync-user-from-clerk" },
    { event: "clerk/user.created" },
    async ({event})=>{
        const {id, first_name, last_name, email_addresses, image_url} = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name +' '+ last_name,
            image: image_url
        }
        await User.create(userData)
    }
)

        // delete user
const syncUserDeletion = inngest.createFunction(
    { id: "delete-user-from-clerk" },
    { event: "clerk/user.deleted" },
    async ({event})=>{
        const {id} = event.data
        await User.findByIdAndDelete(id)
    }
)

const syncUserUpdation = inngest.createFunction(
    { id: "update-user-from-clerk" },
    { event: "clerk/user.updated" },
    async ({event})=>{
         const {id, first_name, last_name, email_addresses, image_url} = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name +' '+ last_name,
            image: image_url
        }
        await User.findByIdAndUpdate(id, userData)
    }
)

const releaseSeatsAndDeleteBooking = inngest.createFunction(
    { id: 'release-seats-delete-booking' },
    { event: 'app/checkpayment' },
    async ({ event, step }) => {
            // Wait for 10 minutes from now
            const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);
            await step.sleepUntil('wait-for-10-minutes',tenMinutesLater);

            await step.run('check-payment-status', async () => {
                const bookingId = event.data.bookingId;
                const booking = await Booking.findById(bookingId)
                if (booking.isPaid) return;

                // Release seats on the show
                const showId = booking.show?._id || booking.show;
                if (!booking.isPaid) {
                    const show = await Show.findById(booking.show);
                    booking.bookedseats.forEach((seat)=>{
                        delete show.occupiedSeats[seat]
                    });
                    show.markedModified('occupiedSeats')
                    await show.save()
                    await Booking.findByIdAndDelete(booking._id)
                }
            })
    }
)
// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserDeletion,
    syncUserCreation,
    syncUserUpdation,
    releaseSeatsAndDeleteBooking
];

// Debug: print exported function ids so we can confirm the server is serving all functions
try {
    const ids = functions.map(f => (f && (f.id || f.name)) || '(unknown)');
    // eslint-disable-next-line no-console
    console.log('[Inngest DEBUG] exported functions:', ids.join(', '));
} catch (e) {
    // ignore
}