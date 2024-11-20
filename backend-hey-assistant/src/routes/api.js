const express = require('express');
const router = express.Router();

// Controller import
const ApiController = require('../controllers/api');
const apiController = new ApiController();

router.post('/ask', apiController.getResponse);

module.exports = router;
