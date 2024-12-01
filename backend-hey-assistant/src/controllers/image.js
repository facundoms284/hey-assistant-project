class ImageController {
  async add(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const { filename } = req.file;
      const url = `http://localhost:8080/uploads/${filename}`;
      const createdAt = new Date();

      const newImage = {
        filename,
        url,
        createdAt,
      };

      res.status(200).json(newImage);
    } catch (error) {
      res.status(500).json({ message: 'Error adding image' });
    }
  }
}

module.exports = ImageController;
