const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({ role: "user" });
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalRevenue = await Order.aggregate([
    { $match: { status: { $ne: "cancelled" } } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);
  const recentOrders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue: totalRevenue[0]?.total || 0,
    recentOrders,
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (user) res.json({ message: "User removed" });
  else { res.status(404); throw new Error("User not found"); }
});

const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.role = req.body.role || user.role;
    await user.save();
    res.json({ message: "User role updated" });
  } else { res.status(404); throw new Error("User not found"); }
});

module.exports = { getDashboardStats, getAllUsers, deleteUser, updateUserRole };
