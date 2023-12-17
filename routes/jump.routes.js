const express = require('express');
const authorize = require('./../middleware/authorize');


const jumpController = require('../controllers/jump.controller');
const router = express.Router();

router.get('/browse', authorize.verifyToken, jumpController.getLogbookPage);
router.get('/add', authorize.verifyToken, jumpController.getRegistrationPage);
router.post('/add', authorize.verifyToken, jumpController.registerJump);

module.exports = router;