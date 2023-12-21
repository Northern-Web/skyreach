const express = require('express');
const authorize = require('./../middleware/authorize');


const jumpController = require('../controllers/jump.controller');
const router = express.Router();

// /members/skydives
router.get('/browse', authorize.verifyToken, jumpController.getLogbookPage);
router.get('/add', authorize.verifyToken, jumpController.getRegistrationPage);
router.get('/import', authorize.verifyToken, jumpController.getImportPage);
router.post('/add', authorize.verifyToken, jumpController.registerJump);
router.post('/upload/excel', authorize.verifyToken, jumpController.uploadExcel);
router.get('/shared/browse/:id', jumpController.getSharedLoogbookPage);


module.exports = router;