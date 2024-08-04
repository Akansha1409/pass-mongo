const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://akanshakalyan1409:o7k4b8FpmFg1fHnw@cluster0.4jyksj6.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Password Schema
const passwordSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  value: String
});

const Password = mongoose.model('Password', passwordSchema);

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/../public/index.html');
});

app.post('/save-password', async (req, res) => {
  const { value } = req.body;
  const password = new Password({ value });
  try {
    await password.save();
    res.status(200).send('Password saved');
  } catch (error) {
    res.status(500).send('Error saving password');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
