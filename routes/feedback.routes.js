const express = require('express');
const authorize = require('./../middleware/authorize');


const aircraftController = require('../controllers/aircraft.controller');
const router = express.Router();

router.get('/browse', authorize.verifyToken, aircraftController.getOverviewPage);
router.get('/:id', authorize.verifyToken, aircraftController.getDetailsPage);

module.exports = router;