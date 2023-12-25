const express = require('express');

const authController = require('../controllers/auth.controller');
const router = express.Router();

router.post('/signin', authController.loginUser);
router.get('/signout', authController.logoutUser);

module.exports = router;