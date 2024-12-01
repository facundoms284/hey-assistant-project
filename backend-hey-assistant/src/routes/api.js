const express = require('express');
const router = express.Router();

const uploadFile = require('../helpers/upload');

// Controllers imports
const ApiController = require('../controllers/api');
const apiController = new ApiController();

const ImageApiController = require('../controllers/imageApi');
const imageApiController = new ImageApiController();

const ImageController = require('../controllers/image');
const imageController = new ImageController();

const upload = require('../helpers/upload');

router.post('/ask', apiController.getResponse);
router.post('/generate', imageApiController.getGeneratedImage);
router.post('/upload', upload.single('image'), imageController.add);

module.exports = router;
