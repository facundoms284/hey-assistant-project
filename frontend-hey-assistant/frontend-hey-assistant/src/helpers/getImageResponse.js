const getImageResponse = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch('http://localhost:8080/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch image data');
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching response:', error);
  }
};

export default getImageResponse;
