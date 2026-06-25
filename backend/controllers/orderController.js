const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const Cart = require("../models/Cart");

const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product", "name images price");
  if (!cart || cart.items.length === 0) {
    res.status(400); throw new Error("No items in cart");
  }
  const order = await Order.create({
    user: req.user._id,
    items: cart.items.map((i) => ({
      product: i.product._id,
      name: i.product.name,
      image: i.product.images[0] || "",
      quantity: i.quantity,
      price: i.price,
    })),
    shippingAddress,
    paymentMethod,
    totalPrice: cart.totalPrice,
  });
  await Cart.findOneAndDelete({ user: req.user._id });
  res.status(201).json(order);
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("items.product", "name images");
  if (order) res.json(order);
  else { res.status(404); throw new Error("Order not found"); }
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json(orders);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.status = req.body.status || order.status;
    order.isDelivered = req.body.status === "delivered";
    order.isPaid = req.body.isPaid !== undefined ? req.body.isPaid : order.isPaid;
    const updated = await order.save();
    res.json(updated);
  } else { res.status(404); throw new Error("Order not found"); }
});

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };
