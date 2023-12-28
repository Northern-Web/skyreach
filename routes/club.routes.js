const express = require('express');
const authorize = require('./../middleware/authorize');


const clubController = require('../controllers/club.controller');
const router = express.Router();

// /members/clubs
router.get('/:countryCode', authorize.verifyToken, clubController.getClubOverviewPage);


module.exports = router;