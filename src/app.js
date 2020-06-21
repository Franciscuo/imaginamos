require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const path = require('path');

const db = require('./database/config');

// Initialization
const app = express();
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));
db.connect();

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const x = "hello";

// Routes
app.use('/api_v1', require('./api/v1.0/routes/users.routes'));


// Static Files
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;