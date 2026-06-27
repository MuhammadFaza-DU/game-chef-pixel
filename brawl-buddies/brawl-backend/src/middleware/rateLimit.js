import rateLimit from 'express-rate-limit';

/** Rate limit umum untuk API publik. */
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Terlalu banyak request, coba lagi nanti.' },
});

/** Limit ketat untuk endpoint auth (cegah brute force). */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Terlalu banyak percobaan login.' },
});
