class ApiModel {
  constructor(HF_API_KEY) {
    this.HF_API_KEY = HF_API_KEY;
  }

  async getResponse(prompt) {
    try {
      const response = await fetch(
        `https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.HF_API_KEY}`,
          },
          body: JSON.stringify({
            inputs: prompt,
          }),
        }
      );

      const data = await response.json();
      return (
        data[0]?.generated_text || 'Sorry, I could not generate a response.'
      );
    } catch (error) {
      console.error(
        'Error fetching response from the Hugging Face API:',
        error.message
      );
    }
  }
}

module.exports = ApiModel;
