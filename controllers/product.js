const Product = require("../models/product");
const Category = require("../models/category");
const fs = require("fs");
const { Op } = require("sequelize");
const utils = require("../utils");

exports.addProduct = async (req, res, next) => {
  try {
    const title = req.body.title;
    const details = req.body.details;
    const price = req.body.price;
    const location = req.body.location;
    const phoneNumber = req.body.phoneNumber;
    const categoryId = req.body.category;
    const productPhoto = req.body.productPhoto;
    let productPhotoBase64 = null;
    if (productPhoto) {
      productPhotoBase64 = await utils.reduce(
        productPhoto.split(";base64,").pop()
      );
    }
    if (
      !title ||
      !details ||
      !price ||
      !location ||
      !phoneNumber ||
      !productPhotoBase64 ||
      !categoryId
    ) {
      res.status(400).json({ message: "Product data must not be null" });
    } else {
      const product = await Product.create({
        title: title,
        details: details,
        price: price,
        location: location,
        phoneNumber: phoneNumber,
        categoryId: categoryId,
        userId: req.user.id,
      });
      const photoDir = "files/images/products/" + product.id;
      await fs.mkdir(photoDir, () => {});
      let data = productPhotoBase64;
      let buffer = Buffer.from(data, "base64");
      await fs.writeFile(photoDir + "/product.jpg", buffer, (err) => {
        console.log(err);
      });
      product.productPhotoPath = photoDir + "/product.jpg";
      await product.save();
      res.status(200).json({ message: "Product Added Successfully" });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    const result = [];
    for (let i = 0; i < products.length; i++) {
      result[i] = {
        id: products[i].id,
        title: products[i].title,
        details: products[i].details,
        price: products[i].price,
        location: products[i].location,
        phoneNumber: products[i].phoneNumber,
        createdAt: products[i].createdAt,
        category: products[i].categoryId,
      };
      const photoPath = products[i].productPhotoPath;
      const photo = fs.readFileSync(photoPath);
      const base64 = photo.toString("base64");
      result[i].productPhoto = base64;
    }
    res.status(200).json({ products: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getAllProductsIds = async (req, res, next) => {
  try {
    const products = await Product.findAll({ attributes: ["id"] });
    const result = [];
    for (let i = 0; i < products.length; i++) {
      result[i] = products[i].id;
    }
    res.status(200).json({ ids: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getLatest12Products = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      limit: 12,
      order: [["id", "DESC"]],
    });
    const result = [];
    for (let i = 0; i < products.length; i++) {
      result[i] = {
        id: products[i].id,
        title: products[i].title,
        details: products[i].details,
        price: products[i].price,
        location: products[i].location,
        phoneNumber: products[i].phoneNumber,
        createdAt: products[i].createdAt,
        category: products[i].categoryId,
      };
      const photoPath = products[i].productPhotoPath;
      const photo = fs.readFileSync(photoPath);
      const base64 = photo.toString("base64");
      result[i].productPhoto = base64;
    }
    res.status(200).json({ products: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getProductsOfCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;
    const products = await Product.findAll({
      where: { categoryId: categoryId },
    });
    const result = [];
    for (let i = 0; i < products.length; i++) {
      result[i] = {
        id: products[i].id,
        title: products[i].title,
        details: products[i].details,
        price: products[i].price,
        location: products[i].location,
        phoneNumber: products[i].phoneNumber,
        createdAt: products[i].createdAt,
        category: products[i].categoryId,
      };
      const photoPath = products[i].productPhotoPath;
      const photo = fs.readFileSync(photoPath);
      const base64 = photo.toString("base64");
      result[i].productPhoto = base64;
    }
    res.status(200).json({ products: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne({ where: { id: id } });
    if (product) {
      const result = {
        id: product.id,
        title: product.title,
        details: product.details,
        price: product.price,
        location: product.location,
        phoneNumber: product.phoneNumber,
        createdAt: product.createdAt,
        category: product.categoryId,
      };
      res.status(200).json({ product: result });
    } else {
      res.status(404).json({ message: "Product Not Found" });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getProductPhoto = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne({ where: { id: id } });
    if (product) {
      const photoPath = product.productPhotoPath;
      const photo = fs.readFileSync(photoPath);
      const base64 = photo.toString("base64");
      res.status(200).json({ photo: base64 });
    } else {
      res.status(404).json({ message: "Product Not Found" });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const title = req.body.title;
    const details = req.body.details;
    const price = req.body.price;
    const location = req.body.location;
    const phoneNumber = req.body.phoneNumber;
    const categoryId = req.body.category;
    const productPhoto = req.body.productPhoto;
    let productPhotoBase64 = null;
    if (productPhoto) {
      productPhotoBase64 = await utils.reduce(
        productPhoto.split(";base64,").pop()
      );
    }

    if (
      !title ||
      !details ||
      !price ||
      !location ||
      !phoneNumber ||
      !productPhotoBase64 ||
      !categoryId
    ) {
      res.status(400).json({ message: "Product data must not be null" });
    } else {
      const product = await Product.findOne({ where: { id: id } });
      if (product) {
        if (product.userId != req.user.id) {
          res
            .status(301)
            .json({ message: "User is not the owner of this product" });
        }
        const photoDir = "files/images/products/" + product.id;
        let data = productPhotoBase64;
        let buffer = Buffer.from(data, "base64");
        await fs.writeFile(photoDir + "/product.jpg", buffer, (err) => {
          console.log(err);
        });
        product.title = title;
        product.details = details;
        product.price = price;
        product.location = location;
        product.phoneNumber = phoneNumber;
        product.categoryId = categoryId;
        await product.save();
        res.status(200).json({ product: product });
      } else {
        res.status(404).json({ message: "Product Not Found" });
      }
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne({ where: { id: id } });
    if (product) {
      if (product.userId != req.user.id) {
        res
          .status(301)
          .json({ message: "User is not the owner of this product" });
      }
      await product.destroy();
      res.status(200).json({ message: "Product Deleted Successfully" });
    } else {
      res.status(404).json({ message: "Product Not Found" });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getMyProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({ where: { userId: req.user.id } });
    const result = [];
    for (let i = 0; i < products.length; i++) {
      result[i] = {
        id: products[i].id,
        title: products[i].title,
        details: products[i].details,
        price: products[i].price,
        location: products[i].location,
        phoneNumber: products[i].phoneNumber,
        createdAt: products[i].createdAt,
        category: products[i].categoryId,
      };
      const photoPath = products[i].productPhotoPath;
      const photo = fs.readFileSync(photoPath);
      const base64 = photo.toString("base64");
      result[i].productPhoto = base64;
    }
    res.status(200).json({ products: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.searchProducts = async (req, res, next) => {
  try {
    let searchText = req.body.searchText.toString();
    const products = await Product.findAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.like]: "%" + searchText + "%",
            },
          },
          {
            details: {
              [Op.like]: "%" + searchText + "%",
            },
          },
        ],
      },
    });
    const result = [];
    for (let i = 0; i < products.length; i++) {
      result[i] = {
        id: products[i].id,
        title: products[i].title,
        details: products[i].details,
        price: products[i].price,
        location: products[i].location,
        phoneNumber: products[i].phoneNumber,
        createdAt: products[i].createdAt,
        category: products[i].categoryId,
      };
      const photoPath = products[i].productPhotoPath;
      const photo = fs.readFileSync(photoPath);
      const base64 = photo.toString("base64");
      result[i].productPhoto = base64;
    }
    res.status(200).json({ products: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
