const express = require('express');

const homeController = require('../controllers/home.controller');
const router = express.Router();

router.get('/', homeController.getLandingPage);
router.get('/signup', homeController.getSignupPage);
router.get('/login', homeController.getLoginPage);
router.get('/page-not-found', homeController.getPageNotFound);

module.exports = router;