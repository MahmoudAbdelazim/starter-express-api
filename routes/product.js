const express = require('express');

const Product = require('../models/product');
const productController = require('../controllers/product');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post(
  '/addProduct',
  authenticate,
  productController.addProduct
);

router.get(
  '/allProducts',
  productController.getAllProducts
);

router.get(
  '/allProductsIds',
  productController.getAllProductsIds
);

router.get(
  '/latestProducts',
  productController.getLatest12Products
)

router.post(
  '/searchProducts',
  productController.searchProducts
)

router.get(
  '/myProducts',
  authenticate,
  productController.getMyProducts
);

router.get(
  '/categoryProducts/:categoryId',
  productController.getProductsOfCategory
);

router.get(
  '/product/:id',
  productController.getProduct
);

router.get(
  '/productPhoto/:id',
  productController.getProductPhoto
);

router.put(
  '/product/:id',
  authenticate,
  productController.updateProduct
);

router.delete(
  '/product/:id',
  authenticate,
  productController.deleteProduct
);

module.exports = router;