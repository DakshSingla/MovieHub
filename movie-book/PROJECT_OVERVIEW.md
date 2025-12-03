# Movie Ticket Booking Frontend (movie-book)

## Overview
This folder contains the React-based frontend for the Movie Ticket Booking application. It provides the user interface for browsing movies, selecting shows, booking seats, and making payments (demo mode).

## Key Concepts & Functionality
- **React Components:** Modular UI for movies, seat selection, booking, payment modal, admin dashboard, etc.
- **Context API:** Centralized state management using `AppContext` for user, bookings, and API calls.
- **Demo Payment Flow:** Demo modal is used for payment simulation.
- **API Integration:** Communicates with backend via REST API endpoints for movies, shows, bookings, and payments.
- **Admin Features:** Admin dashboard for adding shows, viewing bookings, and managing movies.
- **Routing:** Uses React Router for navigation between pages (Home, Movies, MyBookings, Admin, etc.).

## Linking & Data Flow
- **API Calls:** Uses Axios to call backend endpoints (e.g., `/api/booking/create`, `/api/booking/fakepay/:bookingId`).
- **User Auth:** Integrates with Clerk for authentication and user management.
- **State Updates:** After booking/payment, frontend refreshes data to reflect changes (e.g., paid status, seat occupancy).

## File Structure
- `src/components/` - UI components (Navbar, MovieCard, DemoPaymentModal, etc.)
- `src/pages/` - Main pages (Home, Movies, MyBookings, SeatLayout, Admin)
- `src/context/` - AppContext for global state
- `src/lib/` - Utility functions (date formatting, etc.)
- `public/` - Static assets

## API Keys Used
- **VITE_CURRENCY**: Currency symbol for display (from `.env` or Vercel environment)
- **Clerk Publishable Key**: Used for frontend authentication (from `.env`)
- **TMDB API Key**: Used for fetching movie data from TMDB (from backend)

---
For backend and API details, see the `PROJECT_OVERVIEW.md` in the `server` folder.
