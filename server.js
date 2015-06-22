/**
 * Created by jfagan on 3/6/15.
 * server.js
 */

var path = require('path');
global.appRoot = path.resolve(__dirname);

var _ = require('lodash');                // For some functional programming
var fs = require('fs');                   // For using the file system.
var log = require('util').log;            // For better logging (with timestamps)
var inspect = require('util').inspect;
var async = require('async');
var bcrypt = require('bcryptjs');

// Load the configuration file
global.OEConfig = null;
var loadConfig = function (callback) {
    log('[startup] Loading config file.');
    fs.readFile('./oe/config.json', function (err, data) {
        OEConfig = JSON.parse(data);
        callback(err);
    });
};

// Load the Eddi modules
global.oeModules = null;
var loadEddiModules = function (callback) {
    log('[startup] Loading eddi modules');

    require('./oe/oe_server/load-oe-module-information')(function (d) {
        oeModules = d;
        callback(null);
    });
};

// Set up the database
var sequelize, models;
var setupDatabase = function (callback, results) {
    log('[startup] Preparing the database');
    function dbThen(db) {
        sequelize = db.sequelize;
        models = db.models;
        callback(null);
    }

    require('./oe/oe_server/db')(dbThen);
};

// The Express app and all the routes and such
var app;
var getExpressApp = function (callback) {
    log('[startup] Creating express application');
    app = require('./oe/oe_server/create_app');
    callback(null);
};

// Create admin user
var createAdminUser = function (callback) {
    var User = models.User;
    var admin = OEConfig.adminAccount;
    admin.pwd = bcrypt.hashSync(admin.password);

    User.findOrCreate({
        where: {username: admin.username},
        defaults: {
            pwd: admin.pwd,
            email: admin.email,
            fname: admin.firstName,
            lname: admin.lastName
        }
    })
        .then(function (user) {
            log('[createAdminUser] Admin user created');
            callback(null);
        });
};

// Start the oe_server
var startServerQueue = [loadConfig, loadEddiModules, setupDatabase, getExpressApp, createAdminUser];
async.series(startServerQueue, function (err, results) {
    app.listen(OEConfig.appPort, '0.0.0.0');
    log('[startup] Listening on port ' + OEConfig.appPort);
});








