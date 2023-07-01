const express = require('express');

const User = require('../models/user');
const userController = require('../controllers/user');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.get(
  '/allUsers',
  authenticate,
  userController.getAllUsers
);

router.get(
  '/user/:id',
  authenticate,
  userController.getUser
);

router.get(
  '/profile',
  authenticate,
  userController.getProfileDetails
);

router.put(
  '/profile',
  authenticate,
  userController.updateProfile
);

router.get(
  '/profilePic',
  authenticate,
  userController.getProfilePic
);

router.put(
  '/profilePic',
  authenticate,
  userController.updateProfilePic
);

module.exports = router;