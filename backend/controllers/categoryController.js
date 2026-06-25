const asyncHandler = require("express-async-handler");
const Category = require("../models/Category");

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json(category);
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (category) res.json(category);
  else { res.status(404); throw new Error("Category not found"); }
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (category) res.json({ message: "Category removed" });
  else { res.status(404); throw new Error("Category not found"); }
});

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
