import User from '../models/User.js';
import { generateToken, clearTokenCookie } from '../utils/token.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, city, locality } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    // Default avatars based on name initials
    const initialAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=065f46&color=fff&size=150`;

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || '',
      city: city || 'Mumbai',
      locality: locality || '',
      avatar: initialAvatar,
    });

    const token = generateToken(res, user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        city: user.city,
        locality: user.locality,
        favorites: user.favorites,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
    }

    const token = generateToken(res, user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        city: user.city,
        locality: user.locality,
        favorites: user.favorites,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Log out current user & clear cookie
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logout = (req, res) => {
  clearTokenCookie(res);
  res.json({
    success: true,
    message: 'Logged out successfully.',
  });
};

/**
 * @desc    Get currently logged in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites', 'title price thumbnail status category city');
    res.json({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
};
