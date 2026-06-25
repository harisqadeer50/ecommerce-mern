const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products with filter, search, sort, pagination
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const {
    keyword, category, brand, minPrice, maxPrice,
    rating, featured, verified, sort, page = 1, limit = 12,
  } = req.query;

  const query = {};

  if (keyword) {
    query.$or = [
      { name: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
      { tags: { $regex: keyword, $options: 'i' } },
      { brand: { $regex: keyword, $options: 'i' } },
    ];
  }

  // category may arrive as a name ("Electronics") or an ObjectId — resolve names to IDs
  if (category) {
    if (mongoose.Types.ObjectId.isValid(category)) {
      query.category = category;
    } else {
      const catDoc = await Category.findOne({ name: { $regex: `^${category}$`, $options: 'i' } });
      query.category = catDoc ? catDoc._id : null; // null => no matches, but doesn't throw
    }
  }

  // brand may be a single name or a comma-separated list
  if (brand) {
    const brandList = brand.split(',').map(b => b.trim()).filter(Boolean);
    query.brand = brandList.length > 1
      ? { $in: brandList.map(b => new RegExp(`^${b}$`, 'i')) }
      : { $regex: brandList[0], $options: 'i' };
  }

  if (featured === 'true') query.isFeatured = true;
  if (verified === 'true') query.isVerified = true;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (rating) query.rating = { $gte: Number(rating) };

  const sortOptions = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    popular: { sold: -1 },
    rating: { rating: -1 },
  };
  const sortBy = sortOptions[sort] || { createdAt: -1 };

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate('category', 'name slug')
    .sort(sortBy)
    .skip(skip)
    .limit(Number(limit));

  res.json({
    success: true,
    products,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    total,
  });
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true }).populate('category', 'name slug').limit(8);
  res.json({ success: true, products });
});

// @desc    Get single product by id
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404);
    throw new Error('Product not found');
  }
  const product = await Product.findById(id).populate('category', 'name slug');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ success: true, product });
});

// @desc    Create product (admin)
// @route   POST /api/products
// @access  Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

// @desc    Update product (admin)
// @route   PUT /api/products/:id
// @access  Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true,
  });
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json({ success: true, product });
});

// @desc    Delete product (admin)
// @route   DELETE /api/products/:id
// @access  Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  await product.deleteOne();
  res.json({ success: true, message: 'Product removed' });
});

// @desc    Add review
// @route   POST /api/products/:id/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) { res.status(400); throw new Error('Product already reviewed'); }

  product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });

  // Recalculate rating
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

  await product.save();

  res.status(201).json({ success: true, message: 'Review added' });
});

module.exports = {
  getProducts, getFeaturedProducts, getProductById,
  createProduct, updateProduct, deleteProduct,
  createReview,
};
