const Category = require("../models/category");
const fs = require("fs");

exports.addCategory = async (req, res, next) => {
  try {
    if (req.user.role === "ADMIN") {
      const categoryName = req.body.categoryName;
      const categoryNameArabic = req.body.categoryNameArabic;
      if (!categoryName || !categoryNameArabic) {
        res.status(400).json({ message: "Category data must not be null" });
      } else {
        await Category.create({
          categoryName: categoryName,
          categoryNameArabic: categoryNameArabic,
        });
        res.status(200).json({ message: "Category Added Successfully" });
      }
    } else {
      res
        .status(301)
        .json({ message: "User is not authorized for this operation" });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    const result = [];
    for (let i = 0; i < categories.length; i++) {
      result[i] = {
        id: categories[i].id,
        categoryName: categories[i].categoryName,
        categoryNameArabic: categories[i].categoryNameArabic,
      };
    }
    res.status(200).json({ categories: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = await Category.findOne({ where: { id: id } });
    if (category) {
      const result = {
        id: category.id,
        categoryName: category.categoryName,
        categoryNameArabic: category.categoryNameArabic,
      };
      res.status(200).json({ category: result });
    } else {
      res.status(404).json({ message: "Category Not Found" });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    if (req.user.role === "ADMIN") {
      const id = req.params.id;
      const categoryName = req.body.categoryName;
      const categoryNameArabic = req.body.categoryNameArabic;

      if (!categoryName || !categoryNameArabic) {
        res.status(400).json({ message: "Category data must not be null" });
      } else {
        const category = await Category.findOne({ where: { id: id } });
        if (category) {
          category.categoryName = categoryName;
          category.categoryNameArabic = categoryNameArabic;
          await category.save();
          res.status(200).json({ category: category });
        } else {
          res.status(404).json({ message: "Category Not Found" });
        }
      }
    } else {
      res
        .status(301)
        .json({ message: "User is not authorized for this operation" });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    if (req.user.role === "ADMIN") {
      const id = req.params.id;
      const category = await Category.findOne({ where: { id: id } });
      if (category) {
        await category.destroy();
        res.status(200).json({ message: "Category Deleted Successfully" });
      } else {
        res.status(404).json({ message: "Category Not Found" });
      }
    } else {
      res
        .status(301)
        .json({ message: "User is not authorized for this operation" });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
