require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const path = require('path');

const db = require('./database/config');
const { swaggerDocs, swaggerUi } = require('./config/swagger');

// Initialization
const app = express();
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));
db.connect();

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api_v1', require('./api/v1.0/routes/users.routes'));
app.use('/api_v1', require('./api/v1.0/routes/tickets.routes'));
app.use('/api_v1', require('./api/v1.0/routes/technical.routes'));

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
