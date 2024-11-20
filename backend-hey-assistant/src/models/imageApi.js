class ImageApiModel {
  constructor(RUNWARE_API_KEY) {
    this.RUNWARE_API_KEY = RUNWARE_API_KEY;
  }

  async getGeneratedImage(prompt) {
    try {
      const response = await fetch('https://api.runware.ai/v1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          {
            taskType: 'authentication',
            apiKey: this.RUNWARE_API_KEY,
          },
          {
            taskType: 'imageInference',
            taskUUID: '39d7207a-87ef-4c93-8082-1431f9c1dc97',
            positivePrompt: prompt,
            width: 512,
            height: 512,
            modelId: 'civitai:102438@133677',
            numberResults: 1,
          },
        ]),
      });

      if (!response.ok) {
        throw new Error(
          `Request failed with status ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log('imagedata', data);
      return data;
    } catch (error) {
      console.error(
        'Error fetching response from the Runware API:',
        error.message
      );
    }
  }
}

module.exports = ImageApiModel;
