const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const pricingTierSchema = new mongoose.Schema({
  minQty: Number,
  maxQty: Number,
  price: Number,
  label: String,
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    brand: { type: String, default: "" },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    discount: { type: Number, default: 0 },
    pricingTiers: [pricingTierSchema],
    stock: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
    specifications: { type: Map, of: String },
    features: [{ type: String }],
    shipping: { type: String, default: "Worldwide shipping" },
    warranty: { type: String, default: "2 years full warranty" },
    protection: { type: String, default: "Refund Policy" },
    isVerified: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sellerName: { type: String, default: "" },
    sellerLocation: { type: String, default: "" },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
