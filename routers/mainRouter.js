const express = require('express');
const mainController = require('../controllers/mainController');
const router = express.Router();

router.route('/:name').post(mainController.doPost);
router.route('/').get(mainController.doGet);

module.exports = router;
