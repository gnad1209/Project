const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./index.route');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(bodyParser.json());
app.use('/api', routes); // all routes under /api
app.use(errorHandler);

module.exports = app;