const e = require("express");
const fs = require("fs");
const User = require("../models/user");
const utils = require('../utils');

exports.getAllUsers = async (req, res, next) => {
  try {
    if (req.user.role === "ADMIN") {
      const users = await User.findAll();
      const result = [];
      for (let i = 0; i < users.length; i++) {
        result[i] = {
          id: users[i].id,
          name: users[i].name,
          username: users[i].username,
          role: users[i].role,
          location: users[i].location,
          phoneNumber: users[i].phoneNumber,
        };
      }
      res.status(200).json({ users: result });
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

exports.getUser = async (req, res, next) => {
  try {
    if (req.user.role === "ADMIN") {
      const id = req.params.id;
      const user = await User.findOne({ where: { id: id } });
      if (user) {
        const result = {
          id: user.id,
          name: user.name,
          username: user.username,
          role: user.role,
          location: user.location,
          phoneNumber: user.phoneNumber,
        };
        res.status(200).json({ user: result });
      } else {
        res.status(404).json({ message: "User Not Found" });
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

exports.getProfileDetails = async (req, res, next) => {
  try {
    const curUser = req.user;
    const user = await User.findOne({ where: { id: curUser.id } });
    if (user) {
      const result = {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
        location: user.location,
        phoneNumber: user.phoneNumber,
      };
      res.status(200).json({ profileDetails: result });
    } else {
      res.status(404).json({ message: "User Not Found" });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const id = req.user.id;
    const name = req.body.name;
    const username = req.body.username;
    const location = req.body.location;
    const phoneNumber = req.body.phoneNumber;

    if (!name || !username || !location || !phoneNumber) {
      res.status(400).json({ message: "User data must not be null" });
    } else {
      const user = await User.findOne({ where: { id: id } });
      if (user) {
        user.name = name;
        user.username = username;
        user.location = location;
        user.phoneNumber = phoneNumber;
        await user.save();
        res.status(200).json({ user: user });
      } else {
        res.status(404).json({ message: "User Not Found" });
      }
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getProfilePic = async (req, res, next) => {
  try {
    const id = req.user.id;
    const user = await User.findOne({ where: { id: id } });
    if (user) {
      const photoPath = user.profilePicPath;
      if (photoPath) {
        const photo = fs.readFileSync(photoPath);
        const base64 = photo.toString("base64");
        res.status(200).json({ profilePic: base64.toString() });
      } else res.status(200).json({ profilePic: null });
    } else {
      res.status(404).json({ message: "User Not Found" });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateProfilePic = async (req, res, next) => {
  try {
    const id = req.user.id;
    const profilePicBase64 = req.body.profilePic;
    if (!profilePicBase64) {
      console.log(profilePicBase64);
      res.status(400).json({ message: "Profile Pic is null" });
    } else {
      const user = await User.findOne({ where: { id: id } });
      if (user) {
        const photoDir = "files/images/profile-pics/" + user.id;
        await fs.mkdir(photoDir, () => {});
        let data = profilePicBase64.split(";base64,").pop();
        const reducedBase64 = await utils.reduce(data);
        let buffer = Buffer.from(reducedBase64, "base64");
        await fs.writeFile(photoDir + "/profile.jpg", buffer, (err) => {
          console.log(err);
        });
        user.profilePicPath = photoDir + "/profile.jpg";
        await user.save();
        res.status(200).json({ profilePic: profilePicBase64 });
      } else {
        res.status(404).json({ message: "User Not Found" });
      }
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
