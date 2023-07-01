const Sequelize = require("sequelize");

const sequelize = require("../util/database");
const Category = require("./category");
const User = require('./user');

const Product = sequelize.define("product", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  details: {
    type: Sequelize.STRING,
  },
  price: {
    type: Sequelize.NUMBER,
    allowNull: false,
  },
  location: {
    type: Sequelize.STRING,
  },
  phoneNumber: {
    type: Sequelize.STRING,
  },
  productPhotoPath: {
    type: Sequelize.STRING,
  }
});

Category.hasMany(Product, {
  foreignKey: "categoryId",
});
Product.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "category",
});

User.hasMany(Product, {
  foreignKey: "userId"
})
Product.belongsTo(User, {
  foreignKey: "userId",
  as: "user"
});

module.exports = Product;
