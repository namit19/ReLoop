import User from '../models/User.js';
import Product from '../models/Product.js';
import { uploadImageBuffer } from '../config/cloudinary.js';

/**
 * @desc    Get public profile of a user & their active listings
 * @route   GET /api/users/:id
 * @access  Public
 */
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('name avatar city locality createdAt');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
    }

    const products = await Product.find({
      seller: user._id,
      status: 'active',
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      user,
      listingsCount: products.length,
      products,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update current user's profile
 * @route   PATCH /api/users/me
 * @access  Private
 */
export const updateMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const { name, phone, city, locality } = req.body;

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (city) user.city = city.trim();
    if (locality !== undefined) user.locality = locality.trim();

    // Check if new avatar was uploaded
    if (req.file) {
      const uploadResult = await uploadImageBuffer(req.file.buffer, req.file.originalname, 'reloop_avatars');
      user.avatar = uploadResult.url;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get listings created by current user
 * @route   GET /api/users/me/products
 * @access  Private
 */
export const getMyProducts = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { seller: req.user._id };

    if (status && ['active', 'reserved', 'sold'].includes(status)) {
      filter.status = status;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    // Count stats across all statuses
    const [activeCount, reservedCount, soldCount] = await Promise.all([
      Product.countDocuments({ seller: req.user._id, status: 'active' }),
      Product.countDocuments({ seller: req.user._id, status: 'reserved' }),
      Product.countDocuments({ seller: req.user._id, status: 'sold' }),
    ]);

    res.json({
      success: true,
      stats: {
        total: activeCount + reservedCount + soldCount,
        active: activeCount,
        reserved: reservedCount,
        sold: soldCount,
      },
      products,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get user's favorites
 * @route   GET /api/users/me/favorites
 * @access  Private
 */
export const getMyFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'favorites',
      populate: {
        path: 'seller',
        select: 'name avatar city',
      },
    });

    res.json({
      success: true,
      favorites: user ? user.favorites : [],
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Add product to user's favorites
 * @route   POST /api/users/me/favorites/:productId
 * @access  Private
 */
export const addFavorite = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    const user = await User.findById(req.user._id);

    // Prevent duplicate favorites
    if (!user.favorites.includes(productId)) {
      user.favorites.push(productId);
      await user.save();
    }

    res.json({
      success: true,
      message: 'Product added to favorites.',
      favorites: user.favorites,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Remove product from user's favorites
 * @route   DELETE /api/users/me/favorites/:productId
 * @access  Private
 */
export const removeFavorite = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);
    user.favorites = user.favorites.filter((id) => id.toString() !== productId);
    await user.save();

    res.json({
      success: true,
      message: 'Product removed from favorites.',
      favorites: user.favorites,
    });
  } catch (err) {
    next(err);
  }
};
