const express = require('express');
const authorize = require('./../middleware/authorize');


const userController = require('../controllers/user.controller');
const router = express.Router();

router.post('/create', userController.createUser);
router.post('/address', authorize.verifyToken, userController.updateUserAddress);
router.post('/logbookSharing', authorize.verifyToken, userController.toggleLogbookSharing);
router.post('/uploadToDocumentArchive', authorize.verifyToken, userController.uploadUserDocument);

module.exports = router;