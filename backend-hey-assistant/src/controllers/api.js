// Model import
const ApiModel = require('../models/api');
const apiModel = new ApiModel(process.env.HF_API_KEY);

class ApiController {
  async getResponse(req, res) {
    const { question } = req.body;
    try {
      const answer = await apiModel.getResponse(question);
      res.status(200).json({ answer });
    } catch (error) {
      console.error(
        'Failed to get response from the Hugging Face API:',
        error.message
      );
      res
        .status(500)
        .json({ error: 'Error ocurred while getting the response' });
    }
  }
}

module.exports = ApiController;
