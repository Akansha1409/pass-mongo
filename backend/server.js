const express = require('express');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb'); 
const bodyparser = require('body-parser');
const cors = require('cors');

dotenv.config();

// Connecting to the MongoDB Client
const url = process.env.MONGO_URI;
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect()
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
    });

// App & Database
const dbName = 'password';
const app = express();
const port = 3000;

// Middleware
app.use(bodyparser.json());
app.use(cors());

// Get all the passwords
app.get('/', async (req, res) => {
    try {
        const db = client.db(dbName);
        const collection = db.collection('passwords');
        const findResult = await collection.find({}).toArray();
        res.json(findResult);
    } catch (err) {
        console.error('Failed to get passwords', err);
        res.status(500).send('Internal Server Error');
    }
});

// Save a password
app.post('/', async (req, res) => { 
    try {
        const password = req.body;
        const db = client.db(dbName);
        const collection = db.collection('passwords');
        const findResult = await collection.insertOne(password);
        res.send({ success: true, result: findResult });
    } catch (err) {
        console.error('Failed to save password', err);
        res.status(500).send('Internal Server Error');
    }
});

// Delete a password by id
app.delete('/', async (req, res) => { 
    try {
        const { id } = req.body;
        const db = client.db(dbName);
        const collection = db.collection('passwords');
        const findResult = await collection.deleteOne({ id });
        res.send({ success: true, result: findResult });
    } catch (err) {
        console.error('Failed to delete password', err);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
