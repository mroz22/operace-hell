'use strict';

const envPath = process.env.NODE_ENV === 'test' ? './.env' : './.env.test';
require('dotenv').config({path: __dirname + '/'+ envPath});


const express = require('express');
const app = express();

require('./config/logging')(app);
// graphql must be used before body parser
require('./config/api/graphql')(app);

require('./config/cookie-parser')(app);
require('./config/body-parser')(app);
require('./config/template_engine')(app);

require('./config/api/rest')(app);

module.exports = app;