import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Protect routes - requires valid JWT from HttpOnly cookie or Authorization header
 */
export const protect = async (req, res, next) => {
  let token;

  // 1. Check cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Check Authorization header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this resource. Please log in.',
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'reloop_fallback_secret_key_prod_2026';
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.',
    });
  }
};

/**
 * Optional authentication - attaches user if token exists, but doesn't block if not
 */
export const optionalAuth = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const secret = process.env.JWT_SECRET || 'reloop_fallback_secret_key_prod_2026';
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id).select('-password');
    if (user) {
      req.user = user;
    }
  } catch {
    // Silently continue without user
  }

  next();
};
