const express = require('express');
const router = express.Router();

// Controllers imports
const ApiController = require('../controllers/api');
const apiController = new ApiController();

const ImageApiController = require('../controllers/imageApi');
const imageApiController = new ImageApiController();

router.post('/ask', apiController.getResponse);
router.post('/generate', imageApiController.getGeneratedImage);

module.exports = router;
