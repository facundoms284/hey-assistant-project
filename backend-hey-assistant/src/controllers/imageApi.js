const ImageApiModel = require('../models/imageApi');
const imageApiModel = new ImageApiModel(process.env.RUNWARE_API_KEY);

class ImageApiController {
  async getGeneratedImage(req, res) {
    const { prompt } = req.body;
    try {
      const answer = await imageApiModel.getGeneratedImage(prompt);
      res.status(200).json({ answer });
    } catch (error) {
      console.error(
        'Failed to get response from the Runware API:',
        error.message
      );
      res
        .status(500)
        .json({ error: 'Error ocurred while getting the response' });
    }
  }
}

module.exports = ImageApiController;
