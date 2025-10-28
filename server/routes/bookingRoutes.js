import express from 'express';
import { createBooking, getOccupiedSeats } from '../controllers/bookingController.js';
import { fakePayBooking } from '../controllers/fakePaymentController.js';

const bookingRouter = express.Router();
bookingRouter.post('/fakepay/:bookingId', fakePayBooking);
bookingRouter.post('/create', createBooking);
bookingRouter.get('/seats/:showId', getOccupiedSeats);

export default bookingRouter;