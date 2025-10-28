// Stripe webhook handler removed — Stripe integration is no longer used in this project.
// Keeping a lightweight stub so any accidental imports fail fast and return 410.
export const stripeWebhooks = (req, res) => {
  res.status(410).json({ success: false, message: 'Stripe integration removed' });
};