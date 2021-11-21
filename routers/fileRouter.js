const express = require('express');
const fileController = require('../controllers/fileController');
const router = express.Router();

router.route('/:session_uuid').post(fileController.doPost);

module.exports = router;
