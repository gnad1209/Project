const express = require('express');
const bodyParser = require('body-parser');
const routes = require('../index.route');
const errorHandler = require('../server/src/middlewares/errorHandler');

const app = express();

app.use(bodyParser.json());
app.use('/api', routes);
app.use(errorHandler);

module.exports = app;
