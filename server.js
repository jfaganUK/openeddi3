/**
 * Created by jfagan on 3/6/15.
 * index.js
 */

var path = require('path');
global.appRoot = path.resolve(__dirname);

var appPort = 4444; // The port the server runs on.

var _ = require('lodash');                // For some functional programming
var fs = require('fs');                   // For using the file system.
var log = require('util').log;            // For better logging (with timestamps)
var inspect = require('util').inspect;

// Load the Eddi modules
global.oeModules = require('./oe/oe_server/load-oe-module-information')();

// Set up the database
log('--- Preparing the database (Sequelize, PostgreSQL)...');
var sequelize = require('./oe/oe_server/db').sequelize;
var models = require('./oe/oe_server/db').models;

// The Express app and all the routes and such
var app = require('./oe/oe_server/create_app');

// Start the oe_server
app.listen(appPort, '192.168.1.131');
log('--- Listening on port ' + appPort);








