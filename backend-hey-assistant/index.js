// dotenv
require('dotenv').config();
const port = process.env.PORT || 3000;

// express
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World from Express!');
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on "http://localhost:${port}"`);
});
