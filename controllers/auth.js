const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.signup = async (req, res, next) => {
  const username = req.body.username;
  const name = req.body.name;
  const password = req.body.password;
  const location = req.body.location;
  const phoneNumber = req.body.phoneNumber;

  if (!username || !name || !password || !location || !phoneNumber) {
    res.status(400).json({ message: "Signup Data Missing" });
  }
  try {

    const presentUser = await User.findOne({where: {username: username}});
    if (presentUser) {
      res.status(401).json({message: "Username already registered"});
    }
    const hashedPw = await bcrypt.hash(password, 12);
    const user = await User.create({
      username: username,
      password: hashedPw,
      name: name,
      role: "USER",
      location: location,
      phoneNumber: phoneNumber,
    });
    console.log(user);
    res.status(201).json({ message: "User signed up successfully!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    let user = await User.findOne({ where: { username: username } });
    if (!user) {
      res.status(404).json({ message: "Username Not Found" });
    } else {
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        res.status(401).json({ message: "Wrong Password" });
      } else {
        const token = jwt.sign(
          {
            id: user.id,
            username: user.username,
            name: user.name,
            role: user.role,
            location: user.location,
            phoneNumber: user.phoneNumber,
          },
          "somesupersecretsecret",
          { expiresIn: "1d" }
        );
        res.status(200).json({
          token: token,
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role,
          location: user.location,
          phoneNumber: user.phoneNumber,
        });
      }
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
