import Product from '../models/Product.js';
import User from '../models/User.js';
import { uploadImageBuffer, deleteImage } from '../config/cloudinary.js';

/**
 * @desc    Get all products with filtering, search, sorting & pagination
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      condition,
      minPrice,
      maxPrice,
      city,
      status,
      sort,
      page = 1,
      limit = 12,
      featured,
    } = req.query;

    const query = {};

    // Filter by status (default to active for general browsing)
    if (status) {
      query.status = status;
    } else {
      query.status = 'active';
    }

    // Category filter
    if (category && category !== 'All' && category !== 'all') {
      query.category = { $regex: new RegExp(`^${category.trim()}$`, 'i') };
    }

    // Condition filter
    if (condition && condition !== 'All') {
      query.condition = condition;
    }

    // City / Location filter
    if (city && city !== 'All') {
      query['location.city'] = { $regex: new RegExp(city.trim(), 'i') };
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && minPrice !== '') {
        const parsedMin = Number(minPrice);
        if (!isNaN(parsedMin)) query.price.$gte = parsedMin;
      }
      if (maxPrice !== undefined && maxPrice !== '') {
        const parsedMax = Number(maxPrice);
        if (!isNaN(parsedMax)) query.price.$lte = parsedMax;
      }
      // If no valid price constraints were added, clean up
      if (Object.keys(query.price).length === 0) {
        delete query.price;
      }
    }

    // Search keyword query
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: { $regex: regex } },
        { description: { $regex: regex } },
        { brand: { $regex: regex } },
        { category: { $regex: regex } },
        { 'location.city': { $regex: regex } },
      ];
    }

    // Sorting options
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'price-asc') {
      sortOptions = { price: 1, createdAt: -1 };
    } else if (sort === 'price-desc') {
      sortOptions = { price: -1, createdAt: -1 };
    } else if (sort === 'views') {
      sortOptions = { views: -1, createdAt: -1 };
    } else if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    }

    // Pagination calculations
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const [totalProducts, products] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .populate('seller', 'name avatar city createdAt')
        .lean(),
    ]);

    const totalPages = Math.ceil(totalProducts / limitNum);

    res.json({
      success: true,
      count: products.length,
      total: totalProducts,
      totalPages,
      currentPage: pageNum,
      products,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single product by ID & increment view count
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('seller', 'name avatar city locality createdAt phone');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product listing not found.',
      });
    }

    // Count seller's other active listings
    const sellerActiveListingsCount = await Product.countDocuments({
      seller: product.seller._id,
      status: 'active',
      _id: { $ne: product._id },
    });

    // Find similar products in the same category
    const similarProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      status: 'active',
    })
      .limit(4)
      .populate('seller', 'name avatar city')
      .lean();

    res.json({
      success: true,
      product,
      sellerStats: {
        otherListingsCount: sellerActiveListingsCount,
      },
      similarProducts,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new product listing with image upload
 * @route   POST /api/products
 * @access  Private
 */
export const createProduct = async (req, res, next) => {
  try {
    const {
      title,
      description,
      price,
      category,
      subcategory,
      brand,
      condition,
      city,
      locality,
      negotiable,
      thumbnailIndex,
    } = req.body;

    // Validate required fields
    if (!title || !description || price === undefined || !category || !condition || !city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required listing details: title, description, price, category, condition, and city.',
      });
    }

    // Handle images
    let images = [];

    // 1. Files uploaded via Multer
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadImageBuffer(file.buffer, file.originalname, 'reloop_products')
      );
      images = await Promise.all(uploadPromises);
    }
    // 2. Or image URLs sent via JSON / seed
    else if (req.body.imageUrls) {
      const urls = Array.isArray(req.body.imageUrls) ? req.body.imageUrls : [req.body.imageUrls];
      images = urls.map((url, idx) => ({
        url,
        publicId: `seed_${Date.now()}_${idx}`,
      }));
    }

    if (images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one product image is required.',
      });
    }

    // Select thumbnail
    const chosenIndex = parseInt(thumbnailIndex, 10);
    const thumbnail =
      !isNaN(chosenIndex) && images[chosenIndex] ? images[chosenIndex].url : images[0].url;

    const product = await Product.create({
      seller: req.user._id,
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      category: category.trim(),
      subcategory: subcategory ? subcategory.trim() : '',
      brand: brand ? brand.trim() : '',
      condition,
      location: {
        city: city.trim(),
        locality: locality ? locality.trim() : '',
      },
      negotiable: negotiable === 'true' || negotiable === true,
      images,
      thumbnail,
      status: 'active',
    });

    const populatedProduct = await Product.findById(product._id).populate(
      'seller',
      'name avatar city'
    );

    res.status(201).json({
      success: true,
      message: 'Product listed successfully!',
      product: populatedProduct,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update a product listing
 * @route   PATCH /api/products/:id
 * @access  Private (Owner only)
 */
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product listing not found.',
      });
    }

    // Check ownership
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this listing.',
      });
    }

    const {
      title,
      description,
      price,
      category,
      subcategory,
      brand,
      condition,
      city,
      locality,
      negotiable,
      status,
      existingImages,
    } = req.body;

    // Handle keeping existing images vs newly uploaded ones
    let updatedImages = [];

    // Parse existingImages if sent from frontend
    if (existingImages) {
      try {
        const parsed = typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages;
        if (Array.isArray(parsed)) {
          updatedImages = parsed;
        }
      } catch (e) {
        console.error('Failed to parse existingImages JSON:', e);
      }
    } else {
      updatedImages = product.images;
    }

    // Upload newly added files if any
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadImageBuffer(file.buffer, file.originalname, 'reloop_products')
      );
      const newImages = await Promise.all(uploadPromises);
      updatedImages = [...updatedImages, ...newImages];
    }

    if (updatedImages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'A listing must have at least one image.',
      });
    }

    if (title) product.title = title.trim();
    if (description) product.description = description.trim();
    if (price !== undefined) product.price = Number(price);
    if (category) product.category = category.trim();
    if (subcategory !== undefined) product.subcategory = subcategory.trim();
    if (brand !== undefined) product.brand = brand.trim();
    if (condition) product.condition = condition;
    if (city) product.location.city = city.trim();
    if (locality !== undefined) product.location.locality = locality.trim();
    if (negotiable !== undefined) product.negotiable = negotiable === 'true' || negotiable === true;
    if (status) product.status = status;

    product.images = updatedImages;
    product.thumbnail = updatedImages[0].url;

    await product.save();

    const populatedProduct = await Product.findById(product._id).populate(
      'seller',
      'name avatar city'
    );

    res.json({
      success: true,
      message: 'Product updated successfully.',
      product: populatedProduct,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete a product listing
 * @route   DELETE /api/products/:id
 * @access  Private (Owner only)
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product listing not found.',
      });
    }

    // Verify ownership
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this listing.',
      });
    }

    // Delete associated images
    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        if (img.publicId) {
          await deleteImage(img.publicId);
        }
      }
    }

    // Remove from users' favorites
    await User.updateMany({ favorites: product._id }, { $pull: { favorites: product._id } });

    await Product.findByIdAndDelete(product._id);

    res.json({
      success: true,
      message: 'Listing removed successfully.',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update listing status (active, reserved, sold)
 * @route   PATCH /api/products/:id/status
 * @access  Private (Owner only)
 */
export const updateProductStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['active', 'reserved', 'sold'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be active, reserved, or sold.',
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product listing not found.',
      });
    }

    // Verify ownership
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to modify this listing.',
      });
    }

    product.status = status;
    await product.save();

    res.json({
      success: true,
      message: `Product status updated to ${status}.`,
      product,
    });
  } catch (err) {
    next(err);
  }
};
