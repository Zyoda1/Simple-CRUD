const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load env variables
console.log('Mongo URI:', process.env.MONGO_URI);
const mongoose = require('mongoose');
const Team = require('./Models/team');
const { MongoExpiredSessionError } = require('mongodb');



const app = express();
app.use(express.json()); // Middleware for JSON parsing
app.use(cors({
  origin: 'http://127.0.0.1:5500'
}));
 // Enable CORS for all routes

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});

app.get('/', (req, res) => {
    res.send('Hello from Node API Server Updated');
});

mongoose.connect(process.env.MONGO_URI, {
    dbName: 'NodeAPI'
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.log('Connection to MongoDB failed:', err.message);
});


// CREATE a team
app.post('/teams', async (req, res) => {
    try {
        const team = await Team.create(req.body);
        res.status(201).json(team);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ all teams
app.get('/teams', async (req, res) => {
    const teams = await Team.find();
    res.json(teams);
});
app.get('/teams/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching team', error: err.message });
  }
});


// UPDATE a team
app.put('/teams/:id', async (req, res) => {
    try {
        const team = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(team);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE a team
app.delete('/teams/:id', async (req, res) => {
    try {
        await Team.findByIdAndDelete(req.params.id);
        res.json({ message: 'Team deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
