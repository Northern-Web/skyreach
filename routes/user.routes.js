const express = require('express');
const authorize = require('./../middleware/authorize');


const userController = require('../controllers/user.controller');
const router = express.Router();

router.post('/create', userController.createUser);
router.post('/logbook', authorize.verifyToken, userController.updateUserLogbook);
router.post('/address', authorize.verifyToken, userController.updateUserAddress);
router.post('/uploadToDocumentArchive', authorize.verifyToken, userController.uploadUserDocument);
router.post('/password', authorize.verifyToken, userController.updateUserPassword);

module.exports = router;