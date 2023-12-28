const express = require('express');
const authorize = require('./../middleware/authorize');

const membersController = require('../controllers/members.controller');
const router = express.Router();

router.get('/dashboard', authorize.verifyToken, membersController.getDashboardPage);
router.get('/profile', authorize.verifyToken, membersController.getProfilePage);


module.exports = router;