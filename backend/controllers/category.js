import Category from "../models/category.js";

export const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    return res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

export const getAllCategories = async (req, res, next) => {
  const sort = req.sort;
  try {
    const categories = await Category.find({}).sort({ createdAt: "desc" });
    return res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};
