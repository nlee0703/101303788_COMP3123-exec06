const express = require('express');
const mongoose = require('mongoose');
const noteRoutes = require('./routes/NoteRoutes');

// Your MongoDB Atlas connection string goes in the DB_URL environment variable
// (do NOT hard-code your password here, the repo is public).
const DB_URL = process.env.DB_URL || "";
const PORT = process.env.PORT || 8081;

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send("<h1>Welcome to Note taking application - Week06 Exercise</h1>");
});

// Mount the Notes API router (its routes already start with /notes)
app.use(noteRoutes);

// Unknown route
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
});

if (!DB_URL) {
    console.log('DB_URL is not set. Set your MongoDB Atlas connection string first. Exiting now...');
    process.exit(1);
}

// Connect to the database
// (useNewUrlParser / useUnifiedTopology were removed: they are no longer needed in Mongoose 8)
mongoose.connect(DB_URL).then(() => {
    console.log("Successfully connected to the database mongoDB Atlas Server");
    app.listen(PORT, () => {
        console.log("Server is listening on port " + PORT);
    });
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});
