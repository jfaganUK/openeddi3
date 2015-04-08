/**
 * Created by jfagan on 3/6/15.
 * index.js
 */

var path = require('path');
global.appRoot = path.resolve(__dirname);

var appPort = 4444; // The port the server runs on.

var express = require('express');         // The web framework
var session = require('express-session'); // To manage user sessions
var _ = require('lodash');                // For some functional programming
var fs = require('fs');                   // For using the file system.
var log = require('util').log;            // For better logging (with timestamps)
var colors = require('colors');           // For colorful logging. So it's easy to spot specific kinds of messages.


// Set up the express app.
var app = express();
app.set('view engine', 'ejs');

// Load the Eddi modules
global.oeModules = require('./oe/oe_server/load-oe-module-information')();

// Session handling
// TODO: (jfagan) come up with a better secret
app.use(session({
    gendid: function(req) {
        return genuuid()
    },
    secret: 'OpenEddi',
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: false,
        secure: true
    }
}));

// Set up the database
log('--- Preparing the database (Sequelize, PostgreSQL)...');
var sequelize = require('./oe/oe_server/db').sequelize;
var models = require('./oe/oe_server/db').models;

// Specific paths to deal the the Backbone router
var sendOEApp = function (req, res, next) {
    console.log('Send the OE app');
    res.render(__dirname + '/oe/index.ejs',
        {oe: {
            test: 'the test'
        }});
};
app.use(/\/$/, sendOEApp);
app.use('/pool/*', sendOEApp);

// Set up the api routes
require('./oe/oe_server/api/index')(app);

// Paths to different resources
app.use('/oe_client',         express.static(__dirname + '/oe/oe_client'));
app.use('/bower_components/', express.static(__dirname + '/oe/bower_components'));
app.use('/oe_modules',        express.static(__dirname + '/oe/oe_modules'));
app.use('/built.js',          express.static(__dirname + '/built.js'));
app.use('/demo',              express.static(__dirname + '/oe/oe_client/components/demo-oe-eddi-promptbar.html'))



// NOTE: do these two routes last.
// The catch for oe_server errors
app.use(function (err, req, res, next) {
    if(!err) {
        return next();
    } else {
        res.status(500).send('Something broke!');
        console.error(err);
    }
});

// When a page is not found...
app.use(function (err, req, res, next) {
    if(err.status !== 404) {
        return next();
    }
    res.status(404).send('Page not found');
});

// Start the oe_server
app.listen(appPort);
log('--- Listening on port ' + appPort);








