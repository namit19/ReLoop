import Report from '../models/Report.js';
import Product from '../models/Product.js';

/**
 * @desc    Submit a report for a product listing
 * @route   POST /api/reports
 * @access  Private
 */
export const createReport = async (req, res, next) => {
  try {
    const { productId, reason, details } = req.body;

    if (!productId || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and reason for reporting are required.',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product listing not found.',
      });
    }

    const report = await Report.create({
      reporter: req.user._id,
      product: productId,
      reason,
      details: details ? details.trim() : '',
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your report. Our trust & safety team will review it shortly.',
      reportId: report._id,
    });
  } catch (err) {
    next(err);
  }
};
