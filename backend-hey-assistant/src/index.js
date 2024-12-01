require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 3000;
const path = require('path');

const express = require('express');
const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// route
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('Hello World from Express!');
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on "http://localhost:${port}"`);
});
