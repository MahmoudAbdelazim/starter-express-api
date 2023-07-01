const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Category = sequelize.define("category", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  categoryName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  categoryNameArabic: {
    type: Sequelize.STRING,
    allowNull: false,
  }
});

module.exports = Category;
