const express = require("express");
const fileUpload = require("express-fileupload");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const categoryRoutes = require("./routes/category");
const sequelize = require("./util/database");

const app = express();

app.use(
  fileUpload({
    limits: {
      fileSize: 10000000,
    },
    abortOnLimit: true,
  })
);

app.use(express.json({ limit: "10mb" }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/auth", authRoutes);

app.use("/users", userRoutes);

app.use("/products", productRoutes);

app.use("/categories", categoryRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    // Category.create({
    //   categoryNameArabic: "أراضى زراعية",
    //   categoryName: "agricultural-lands"
    // });
    // Category.create({
    //   categoryNameArabic: "آلات زراعية",
    //   categoryName: "agricultural-machinery"
    // });
    // Category.create({
    //   categoryNameArabic: "تسويق محاصيل",
    //   categoryName: "crop-marketing"
    // });
    // Category.create({
    //   categoryNameArabic: "مشاركة محاصيل",
    //   categoryName: "share-crops"
    // });
    // Category.create({
    //   categoryNameArabic: "حدائق ريفية",
    //   categoryName: "country-gardens"
    // });
    app.listen(3001);
  })
  .catch((err) => {
    console.log(err);
  });
