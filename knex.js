'use strict';

const knexConfig = require('./knexfile');

const environment = process.env.NODE_ENV || 'development';

module.exports = require('knex')(knexConfig[environment]); 
// requiring knex creates a function, but what does it mean that knexConfig && environment are passed in as one argument like this?
