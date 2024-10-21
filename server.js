const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Import CORS middleware
require('dotenv').config(); // Load environment variables

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors()); // Enable CORS

// Create a connection pool
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

// Log environment variables for debugging
console.log('Database User:', process.env.DB_USER);
console.log('Database Host:', process.env.DB_HOST);

// Test database connection
db.getConnection((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the database.');
    }
});

// Root route handler
app.get('/', (req, res) => {
    res.send('Welcome to the homepage!'); // Response for root URL
});

// 1. Retrieve all patients
app.get('/patients', (req, res) => {
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching patients:', err.message);
            return res.status(500).send('Server Error');
        }
        res.json(results);
    });
});

// 2. Retrieve all providers
app.get('/providers', (req, res) => {
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching providers:', err.message);
            return res.status(500).send('Server Error');
        }
        res.json(results);
    });
});

// 3. Filter patients by First Name
app.get('/patients/filter', (req, res) => {
    const firstName = req.query.first_name;

    if (!firstName) {
        return res.status(400).send('First name query parameter is required.');
    }

    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';

    db.query(query, [firstName], (err, results) => {
        if (err) {
            console.error('Error fetching patients:', err.message);
            return res.status(500).send('Server Error');
        }
        res.json(results);
    });
});

// 4. Retrieve all providers by their specialty
app.get('/providers/filter', (req, res) => {
    const specialty = req.query.specialty;

    if (!specialty) {
        return res.status(400).send('Specialty query parameter is required.');
    }

    const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';

    db.query(query, [specialty], (err, results) => {
        if (err) {
            console.error('Error fetching providers:', err.message);
            return res.status(500).send('Server Error');
        }
        res.json(results);
    });
});

// Listen to the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});