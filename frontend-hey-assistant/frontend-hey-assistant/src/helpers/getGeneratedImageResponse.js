const getGeneratedImageResponse = async (prompt) => {
  try {
    const response = await fetch('http://localhost:8080/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch image data');
    }

    const data = await response.json();

    return data?.answer?.data[0]?.imageURL;
  } catch (error) {
    console.error('Error fetching response:', error);
  }
};

export default getGeneratedImageResponse;
