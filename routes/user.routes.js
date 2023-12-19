const express = require('express');
const authorize = require('./../middleware/authorize');


const userController = require('../controllers/user.controller');
const router = express.Router();

router.post('/address', authorize.verifyToken, userController.updateUserAddress);
router.post('/logbookSharing', authorize.verifyToken, userController.toggleLogbookSharing);

module.exports = router;