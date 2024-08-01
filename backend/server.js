const express = require('express');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();

// Connecting to the MongoDB Client
const url = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

// const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
const client = new MongoClient(url);

client.connect()
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// App & Database
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Get all the passwords
app.get('/', async (req, res) => {
    try {
        const db = client.db(dbName);
        const collection = db.collection('passwords');
        const findResult = await collection.find({}).toArray();
        res.json(findResult);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch passwords' });
    }
});

// Save a password
app.post('/', async (req, res) => {
    try {
        const password = req.body;
        const db = client.db(dbName);
        const collection = db.collection('passwords');
        const insertResult = await collection.insertOne(password);
        res.json({ success: true, result: insertResult });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save password' });
    }
});

// Delete a password by id
app.delete('/', async (req, res) => {
    try {
        const { id } = req.body;
        const db = client.db(dbName);
        const collection = db.collection('passwords');
        const deleteResult = await collection.deleteOne({ id });
        res.json({ success: true, result: deleteResult });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete password' });
    }
});

// Close MongoDB connection on server shutdown
process.on('SIGINT', () => {
    client.close().then(() => {
        console.log('MongoDB connection closed');
        process.exit(0);
    });
});

app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`);
});
