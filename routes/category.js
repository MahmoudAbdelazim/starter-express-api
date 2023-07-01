const express = require('express');

const Category = require('../models/category');
const categoryController = require('../controllers/category');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post(
  '/addCategory',
  authenticate,
  categoryController.addCategory
);

router.get(
  '/allCategories',
  categoryController.getAllCategories
);

router.get(
  '/category/:id',
  categoryController.getCategory
);

router.put(
  '/category/:id',
  authenticate,
  categoryController.updateCategory
);

router.delete(
  '/category/:id',
  authenticate,
  categoryController.deleteCategory
);

module.exports = router;