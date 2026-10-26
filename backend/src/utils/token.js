import jwt from 'jsonwebtoken';

/**
 * Generate JWT and optionally set in HttpOnly cookie
 */
export const generateToken = (res, userId) => {
  const secret = process.env.JWT_SECRET || 'reloop_fallback_secret_key_prod_2026';
  const token = jwt.sign({ id: userId }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  if (res && typeof res.cookie === 'function') {
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  return token;
};

/**
 * Clear authentication cookie
 */
export const clearTokenCookie = (res) => {
  if (res && typeof res.cookie === 'function') {
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token', '', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      expires: new Date(0),
    });
  }
};
