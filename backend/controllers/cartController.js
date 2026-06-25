const asyncHandler = require("express-async-handler");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product", "name images price stock");
  res.json(cart || { items: [], totalPrice: 0 });
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) { res.status(404); throw new Error("Product not found"); }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = new Cart({ user: req.user._id, items: [] });

  const existingItem = cart.items.find((i) => i.product.toString() === productId);
  if (existingItem) {
    existingItem.quantity += Number(quantity);
  } else {
    cart.items.push({ product: productId, quantity: Number(quantity), price: product.price });
  }
  cart.totalPrice = cart.items.reduce((a, i) => a + i.price * i.quantity, 0);
  await cart.save();
  await cart.populate("items.product", "name images price stock");
  res.json(cart);
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  const item = cart.items.find((i) => i.product.toString() === req.params.productId);
  if (item) {
    item.quantity = Number(quantity);
    cart.totalPrice = cart.items.reduce((a, i) => a + i.price * i.quantity, 0);
    await cart.save();
    await cart.populate("items.product", "name images price stock");
    res.json(cart);
  } else {
    res.status(404); throw new Error("Item not found in cart");
  }
});

const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
  cart.totalPrice = cart.items.reduce((a, i) => a + i.price * i.quantity, 0);
  await cart.save();
  res.json(cart);
});

const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.json({ message: "Cart cleared" });
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
