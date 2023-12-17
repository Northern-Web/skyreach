const express = require('express');

const homeController = require('../controllers/home.controller');
const router = express.Router();

router.get('/', homeController.getLandingPage);
router.get('/signup', homeController.getSignupPage);

module.exports = router;