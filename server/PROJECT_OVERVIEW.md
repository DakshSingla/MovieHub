# Movie Ticket Booking Backend (server)

## Overview
This folder contains the Express.js backend for the Movie Ticket Booking application. It manages all business logic, data storage, authentication, and email notifications.

## Key Concepts & Functionality
- **Express.js API:** RESTful endpoints for movies, shows, bookings, payments, and admin actions.
- **MongoDB Models:** Data models for User, Movie, Show, Booking.
- **Clerk Authentication:** Uses Clerk for secure user authentication and role management.
- **Demo Payment Flow:** Demo payment endpoint (`/api/booking/fakepay/:bookingId`) marks bookings as paid and sends confirmation emails.
- **Email Notifications:** Sends booking confirmation emails using Nodemailer and Gmail App Passwords.
- **Admin Features:** Endpoints for adding shows, listing bookings, and managing movies.
- **Error Handling & Logging:** Robust error handling and logging for debugging and reliability.

## Linking & Data Flow
- **Frontend Integration:** Receives requests from React frontend via Axios (e.g., booking creation, payment, seat status).
- **Clerk User Linking:** Bookings are linked to Clerk user IDs; emails are fetched from Clerk API for notifications.
- **Environment Variables:** Sensitive keys and credentials are stored in `.env` (never committed to source control).

## File Structure
## File Structure & Linking

- `controllers/` - Contains route handler functions for each API endpoint. Controllers use models to interact with the database and call utilities for tasks like sending emails. For example, `bookingController.js` handles booking creation and calls `sendBookingEmail.js` from `utils/`.
- `models/` - Defines Mongoose schemas for each data entity (User, Movie, Show, Booking). Models are imported by controllers to read/write data in MongoDB.
- `routes/` - Maps API endpoints to controller functions. For example, `bookingRoutes.js` connects `/api/booking/create` to `createBooking` in `bookingController.js`.
- `middleware/` - Provides reusable logic for authentication and admin protection. Middleware is used in routes to secure endpoints (e.g., only admins can access certain routes).
- `utils/` - Utility functions like `sendBookingEmail.js` are called by controllers to perform tasks (e.g., sending emails after payment).
- `configs/` - Handles database connection setup. Used by the main server file to connect to MongoDB.

### How Files Work Together
- **Routes** import **controllers** to handle requests.
- **Controllers** use **models** to access data and **utils** for extra tasks (like email).
- **Middleware** is added to **routes** to protect endpoints.
- **Configs** are loaded at server startup to connect to the database.

This modular structure keeps code organized, makes it easy to maintain, and allows each part of the backend to work together efficiently.

## API Keys Used
- **MONGODB_URI**: MongoDB connection string
- **CLERK_PUBLISHABLE_KEY**: Clerk frontend key
- **CLERK_SECRET_KEY**: Clerk backend key (used for API calls)
- **TMDB_API_KEY**: For fetching movie data from TMDB
- **EMAIL_USER**: Gmail address for Nodemailer
- **EMAIL_PASS**: Gmail App Password for Nodemailer

---
For frontend details, see the `PROJECT_OVERVIEW.md` in the `movie-book` folder.
